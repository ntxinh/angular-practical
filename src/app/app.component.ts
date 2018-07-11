import { Component, TemplateRef, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as Query from './global-query';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  modalRef: BsModalRef;
  todos: Array<any> = []; // List of Todo
  todo: any = {};
  content: any;

  constructor(private apollo: Apollo,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getTodos();
  }

  createTodo(value) {
    this.apollo
      .mutate({
        mutation: Query.createTodo,
        variables: {
          content: value
        },
        update: (proxy, { data: { createTodo } }) => {
          // Read the data from our cache for this query.
          const data: any = proxy.readQuery({ query: Query.todos });

          data.todo.push(createTodo);

          // Write our data back to the cache.
          proxy.writeQuery({ query: Query.todos, data });
        }
      })
      .subscribe(({ data }) => {
        this.closeFirstModal(); // Close Modal
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
  }

  checkTodo(id) {
    this.apollo
      .mutate({
        mutation: Query.checkTodo,
        variables: {
          id: id
        },
        update: (proxy, { data: { checkTodo } }) => {
          this.getTodos();
        }
      })
      .subscribe(({ data }) => {
        console.log(data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
  }

  removeTodo(id) {
    this.apollo
      .mutate({
        mutation: Query.deleteTodo,
        variables: {
          id: id
        },
        update: (proxy, { data: { deleteTodo } }) => {
          // Read the data from our cache for this query.
          const data: any = proxy.readQuery({ query: Query.todos });

          const index = data.todo.map(function (x) { return x.id; }).indexOf(id);

          data.todo.splice(index, 1);

          // Write our data back to the cache.
          proxy.writeQuery({ query: Query.todos, data });
        }
      })
      .subscribe(({ data }) => {
        console.log(data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
  }

  showEditTodoForm(todo, template) {
    this.content = todo.content;
    this.todo = todo;
    this.modalRef = this.modalService.show(template);
  }

  updateTodo(todo) {
    // this.apollo
    //   .mutate({
    //     mutation: Query.updateTodo,
    //     variables: {
    //       _id: this.todo.id,
    //       content: this.content
    //     },
    //     update: (proxy, { data: { updateTodo } }) => {
    //       // Read the data from our cache for this query.
    //       const data: any = proxy.readQuery({ query: Query.todos });

    //       const index = data.todo.map(function (x) { return x.id; }).indexOf(this.todo.id);

    //       data.todo[index].name = todo;

    //       // Write our data back to the cache.
    //       proxy.writeQuery({ query: Query.todos, data });
    //     }
    //   })
    //   .subscribe(({ data }) => {
    //     this.closeFirstModal();
    //   }, (error) => {
    //     console.log('there was an error sending the query', error);
    //   });
  }

  getTodos() {
    this.apollo.watchQuery({ query: Query.todos })
      .valueChanges
      .pipe(map((result: any) => result.data.todo))
      .subscribe((data) => {
        this.todos = data;
      });
  }

  // Open Modal
  openModal(template: TemplateRef<any>) {
    this.content = '';
    this.todo = {};
    this.modalRef = this.modalService.show(template);
  }

  // Close Modal
  closeFirstModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
