import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';

@Component({
    selector: 'todos',
    templateUrl: 'todo.component.html'
})
export class TodoComponent implements OnInit {
    public todoList: Array<Object>;
    constructor(public todoService: TodoService) {
        this.todoList = [];
        this.todoService.todoListSubject$.subscribe(todos=>{
            this.todoList = todos;
        })
    }

    ngOnInit() { }
    changeStatus(todo: any) {
        this.todoService.updateStatus(todo);
    }
    addNewTodo(newItem: string) {
        this.todoService.addTodo(newItem);
    }
    removeTodo(todo: any) {
        this.todoService.removeTodo(todo);
    }
}