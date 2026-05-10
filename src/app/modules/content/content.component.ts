import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Character } from 'src/app/models/charactes';
import { ContentService } from '../services/content.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  form: FormGroup;
  characters: Character[] = [];

  constructor(private fb: FormBuilder,
    private userServ: UserService,
    private contentServ: ContentService,
    private dialogRef: MatDialogRef<ContentComponent>
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      characters: ['', Validators.required],
      description: ['']
    });
  }

  // constructor removed; FormBuilder constructor is used above

  ngOnInit(): void {
    console.log('ppp');
    this.getUsers();
  }

  getUsers() {
    this.userServ.fetchUsers().subscribe({
      next: (res: Character[]) => {
        this.characters = res;
      },
      error: (err) => {

      }
    })
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Content form submit', this.form.value);
    let payload = this.form.value;
    payload.chat = []
    this.contentServ.createContent(payload).subscribe({
      next: (res) => {
        console.log('Content created', res);
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error('Error creating content', err);
      }
    });
    // TODO: call service to save content
  }

  cancel() {
    this.form.reset();
  }



}
