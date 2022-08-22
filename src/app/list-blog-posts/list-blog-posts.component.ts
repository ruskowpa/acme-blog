import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { BlogPost } from '../models/blog-post-model';

@Component({
  selector: 'app-list-blog-posts',
  templateUrl: './list-blog-posts.component.html',
  styleUrls: ['./list-blog-posts.component.css']
})
export class ListBlogPostsComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  active!: number;
  newModal: any;
  editModal: any;
  newPost = new BlogPost();
  editPost = new BlogPost();
  toasts: any[] = [];
  errorMsg = '';

  constructor(private http: HttpClient,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getPosts();
    this.reInitNewPost();
  }

  getPosts(): void  {
    this.http.get<BlogPost[]>('http://localhost:5036/BlogPost/GetAllBlogPosts').subscribe(data => {
      this.blogPosts = data;
      this.active = data[0].id;
    }, (err => {
      this.errorMsg = 'Could not Load Posts';
      })
    );
  }

  saveNewPost(): void {
    this.newPost.id = 0; 
    this.http.post('http://localhost:5036/BlogPost/Create', this.newPost).subscribe(data => {
      this.getPosts();
      this.closeNewModal();
  },(err => {
    this.errorMsg = 'Could not Save New Post';
    })
  );
}

deletePost(postId: number): void {
  this.http.delete('http://localhost:5036/BlogPost/Delete/' + postId).subscribe(data => {
    this.getPosts();
  },(err => {
    this.errorMsg = 'Could Not Delete Post';
    })
  );
}

saveEditPost(): void {
  this.http.put('http://localhost:5036/BlogPost/Edit', this.editPost).subscribe(data => {
    this.getPosts();
    this.closeEditModal();
},(err => {
  this.errorMsg = 'Could Not Edit Post';
  })
);
}

reInitNewPost(): void{
  this.newPost.id = 0;
  this.newPost.title = "";
  this.newPost.content = "";

  this.editPost.id = 0;
  this.editPost.title = "";
  this.editPost.content = "";
}

openNewModal(content: any): void {
  this.newModal = this.modalService.open(content, { size: "xl", backdrop: "static", keyboard: false });
}

openEditModal(content: any, postToEdit: BlogPost): void {
  this.editModal = this.modalService.open(content, { size: "xl", backdrop: "static", keyboard: false });
  this.editPost = Object.assign({}, postToEdit);
}

closeNewModal(): void {
    this.newModal.close();
    this.reInitNewPost();
  }

closeEditModal(): void {
    this.editModal.close();
  }

}
