import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TransactionService} from '../../../services/transaction.service';
import {FormsModule} from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
import {UserService} from '../../../services/user.service';
import {User} from "../../../models/user";

@Component({
    selector: 'app-transaction-table-form',
    standalone: true,
    imports: [
        FormsModule,
        TitleCasePipe
    ],
    templateUrl: './transaction-add-form.component.html',
    styleUrl: './transaction-add-form.component.css'
})
export class TransactionAddFormComponent implements OnInit {
    @Input() type!: 'income' | 'expense';
    @Output() transactionAdded = new EventEmitter<void>();

    activeUser: User | null = null;

    transaction = {
        user: null as User | null,
        category: null,
        amount: null,
        date: '',
        description: ''
    };

    constructor(private transactionService: TransactionService,
                private userService: UserService) {
    }

    ngOnInit(): void {
    }

    onUserChange(user: User): void {
        this.activeUser = user;
        this.transaction.user = user;
    }


    addTransaction(): void {
        if (!this.transaction.amount || !this.transaction.date) {
            alert('Amount and Date are required!');
            return;
        }

        const transactionData = {
            ...this.transaction,
            userId: this.transaction.user ? this.transaction.user.id : null // <-- Lisa `userId`
        };

        this.transactionService.addTransaction(this.type, transactionData).subscribe({
            next: () => {
                alert(`${this.type} added successfully!`);
                this.transactionAdded.emit();
                this.transaction = {
                    user: null,  // <-- Reset user valik
                    category: null,
                    amount: null,
                    date: '',
                    description: ''
                };
            },
            error: (err) => {
                console.error('Error adding transaction-table:', err);
                alert('Failed to add transaction-table.');
            }
        });
    }

}
