import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userForm!: FormGroup;
  // options for the content multi-select
  contentOptions = [
    { id: 'AL', name: 'Alabama' },
    { id: 'AK', name: 'Alaska' },
    { id: 'AZ', name: 'Arizona' },
    { id: 'AR', name: 'Arkansas' },
    { id: 'CA', name: 'California' },
    { id: 'CO', name: 'Colorado' },
    { id: 'CT', name: 'Connecticut' },
    { id: 'DE', name: 'Delaware' },
    { id: 'DC', name: 'District of Columbia' },
    { id: 'FL', name: 'Florida' },
    { id: 'SC', name: 'South Carolina' },
    { id: 'WY', name: 'Wyoming' },
  ];
  selectedFile: File | null = null;
  selectedPreview: string | null = null;
  editingId: number | null = null;
  viewOnly: boolean = false;
  // state for API bindings
  users: any[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.createUserForm();
    // optionally load users to show current list or for other bindings
    this.loadUsers();

    // if dialog was opened with existing user data, populate form
    if (this.dataModal && this.dataModal.user) {
      const u = this.dataModal.user;
      this.editingId = u.id;
      this.userForm.patchValue({
        name: u.name || '',
        shortname: u.shortname || '',
        gender: u.gender || '',
        address: u.address || '',
        age: u.age || '',
        relation: u.relation || '',
        content: u.content || [],
        isActive: !!u.isActive,
      });
      if (u.picture) {
        this.selectedPreview = u.picture.startsWith('http') ? u.picture : `http://localhost:8000${u.picture}`;
      }
      this.viewOnly = this.dataModal.mode === 'view';
      if (this.viewOnly) this.userForm.disable();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      if (this.selectedPreview) {
        URL.revokeObjectURL(this.selectedPreview);
        this.selectedPreview = null;
      }
      return;
    }
    this.selectedFile = input.files[0];
    console.log('Selected file:', this.selectedFile.name);
    // create object URL for preview
    if (this.selectedPreview) {
      URL.revokeObjectURL(this.selectedPreview);
    }
    this.selectedPreview = URL.createObjectURL(this.selectedFile);
  }

  getContentNames(): string {
    const values = this.userForm.get('content')?.value || [];
    if (!Array.isArray(values) || values.length === 0) return 'None';
    return this.contentOptions
      .filter(opt => values.includes(opt.id))
      .map(o => o.name)
      .join(', ');
  }

  constructor(public dialogRef: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public dataModal: any, private userServ: UserService) {

  }

  createUserForm() {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      shortname: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      address: new FormControl(''),
      age: new FormControl(''),
      relation: new FormControl(''),
      content: new FormControl(['AZ', 'SC', 'WY']),
      isActive: new FormControl(false),
    });
  }

  submitForm() {
    if (this.userForm.valid) {
      // Build FormData payload including the picture file
      const formData = new FormData();
      const v = this.userForm.value;
      formData.append('name', v.name || '');
      formData.append('address', v.address || '');
      formData.append('relation', v.relation || '');
      formData.append('shortname', v.shortname || '');
      formData.append('gender', v.gender || '');
      formData.append('isActive', v.isActive ? 'true' : 'false');
      // content: send as JSON string of selected ids
      formData.append('content', JSON.stringify(v.content || []));
      // age: if present, send as string
      if (v.age) {
        formData.append('age', String(v.age));
      }
      if (this.selectedFile) {
        formData.append('picture', this.selectedFile, this.selectedFile.name);
      }

      // use UserService to create or update the user so all API wiring is centralized
      this.isLoading = true;
      this.error = null;
      if (this.editingId) {
        this.userServ.updateUser(this.editingId, formData).subscribe({
          next: (res) => {
            console.log('Updated', res);
            this.dialogRef.close(res);
          },
          error: (err) => {
            console.error('updateUser error', err);
            this.error = 'Failed to update user';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.userServ.createUser(formData).subscribe({
          next: (res) => {
            console.log('Uploaded', res);
            this.dialogRef.close(res);
          },
          error: (err) => {
            console.error('createUser error', err);
            this.error = 'Failed to create user';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    } else {
      console.log('Form Not Valid');
      this.userForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    if (this.selectedPreview) {
      URL.revokeObjectURL(this.selectedPreview);
    }
  }

  enableEditing(): void {
    this.viewOnly = false;
    this.userForm.enable();
  }

  // loads users list via the service (optional; used here to demonstrate binding)
  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.userServ.fetchUsers().subscribe({
      next: (res: any[]) => {
        this.users = res || [];
      },
      error: (err) => {
        console.error('fetchUsers error', err);
        this.error = 'Failed to load users';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


}
