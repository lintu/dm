import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { FirebaseHelperService } from './firebase-helper.service';

@Injectable()
export class TodoService {

    public todoList: Array<Object>
    public todoListSubscription: Subscription;
    public todoListSubject$: Subject<Array<Object>>;
    constructor(public firebaseHelper: FirebaseHelperService) { 
        this.todoList = [];
        this.todoListSubject$ = new Subject<Array<Object>>();
        this.todoListSubscription = this.firebaseHelper.todoListSubject$.subscribe(todos=>{
            this.todoList = todos;
            this.todoListSubject$.next(todos);
        });
        this.firebaseHelper.startTodoSubscription();
    }
    updateStatus(todo: any) {
        this.firebaseHelper.updateTodolist(todo);
    }
    addTodo(todo: string) {
        this.firebaseHelper.addTodoItem(todo);
    }
    removeTodo(todo: any) {
        this.firebaseHelper.removeTodoItem(todo);
    }
}