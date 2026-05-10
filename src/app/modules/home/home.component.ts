import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from '../user/user.component';
import { UserService } from '../services/user.service';
import { ContentComponent } from '../content/content.component';
import { ContentService } from '../services/content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userList: any[] = [];
  contentList: any[] = [];
  currentList: any = 'content-list';

  constructor(
    private dialog: MatDialog,
    private userServ: UserService,
    private contentServ: ContentService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchContents();
  }

  fetchUsers() {
    this.userServ.fetchUsers().subscribe({
      next: data => this.userList = data || [],
      error: err => console.error('Failed to load characters', err)
    });
  }

  fetchContents() {
    this.contentServ.getContent().subscribe({
      next: (data: any) => this.contentList = data || [],
      error: err => console.error('Failed to load contents', err)
    });
  }

  getAvatarUrl(user: any): string {
    const p = user?.picture || '';
    if (!p) return './static/avatars/010m.jpg';
    if (p.startsWith('http')) return p;
    // ensure proper leading slash
    const path = p.startsWith('/') ? p : `/${p}`;
    return `http://localhost:8000${path}`;
  }

  openUser() {

    const ref = this.dialog.open(UserComponent, {
      width: '60%',
      data: { message: 'Hello from dialog!' }
    });
    ref.afterClosed().subscribe(() => this.fetchUsers());
  }

  openProfile(user: any) {
    const ref = this.dialog.open(UserComponent, {
      width: '60%',
      data: { user, mode: 'view' }
    });
    ref.afterClosed().subscribe((res) => {
      // refresh list in case of edits
      this.fetchUsers();
    });
  }


  openContent() {
    console.log('--jk');

    // implement content dialog opening logic here
    const ref = this.dialog.open(ContentComponent, {
      width: '40%',
      data: { message: 'Hello from dialog!' }
    });
    ref.afterClosed().subscribe(() => this.fetchContents());
  }

  onDelete(user: any) {
    console.log('Delete user', user);

    if (!user || !user.id) return;
    const confirmed = confirm(`Delete "${user.name || user.shortname || 'this user'}"?`);
    if (!confirmed) return;

    this.userServ.deleteUser(user.id).subscribe({
      next: () => {
        // remove locally for immediate UI feedback
        this.userList = this.userList.filter(u => u.id !== user.id);
        this.fetchUsers();
      },
      error: err => {
        console.error('Delete failed', err);
        alert('Failed to delete user');
      }
    });
  }

  onDeleteContent(content: any) {
    console.log('Delete content', content);

    if (!content || !content.id) return;
    const confirmed = confirm(`Delete "${content.name || 'this content'}"?`);
    if (!confirmed) return;

    this.contentServ.deleteContent(content.id).subscribe({
      next: () => {
        // remove locally for immediate UI feedback
        this.contentList = this.contentList.filter(c => c.id !== content.id);
        this.fetchContents();
      },
      error: (err: any) => {
        console.error('Delete failed', err);
        alert('Failed to delete content');
      }
    });
  }

  openChat(content: any) {
    // implement chat opening logic here
    this.route.navigate(['/chat', content.id]);
  }

}

