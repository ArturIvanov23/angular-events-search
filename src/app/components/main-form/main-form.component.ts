import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroupDirective, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestService } from '../../services/rest.service';
import { Subscription } from 'rxjs';
import { DialogData, IEvent } from '../../types';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainFormComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];



  eventsForm = this.fb.group({
    nameSurname: [null, Validators.required],
    department: [null, Validators.required],
    event: [null, Validators.required],
    theme: [null, Validators.required],
    text: [null, Validators.required],
    file: [null],
    date: [new Date().toLocaleString(), Validators.required]
  });

  public search = '';

  events: IEvent[] = [];

  eventCategories = [
    { name: 'Покупка авто', abbreviation: '1' },
    { name: 'Продажа авто', abbreviation: '2' },
    { name: 'Сервис авто', abbreviation: '3' }
  ];
  getEvents: any;

  constructor(
    private fb: FormBuilder, private snackBar: MatSnackBar,
    private restService: RestService, public dialog: MatDialog
  ) {
  }

  public get searched(): IEvent[] {
    if (this.search.length >= 3) {
      return this.events.filter(item => item.theme && item.theme.includes(this.search));
    }
  }

  private showNotify(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public onInput(event): void {
    this.subscriptions.push(
      this.restService.getEvents().subscribe((events: IEvent[]) => {
        this.events = events;
      })
    );
    this.search = event.target.value;
  }

  public onSubmit(formDirective: FormGroupDirective): void {
    this.restService.sendEvent(this.eventsForm.getRawValue()).subscribe((res: IEvent) => {
      this.events.push(res);
      setTimeout(() => {
        this.onClear(formDirective, 'Данные успешно отправлены');
      }, 0);
    });
  }

  public onClear(formDirective: FormGroupDirective, message = 'Форма очищена'): void {
    formDirective.resetForm();
    this.eventsForm.reset();
    this.eventsForm.patchValue({ date: new Date().toLocaleString() });
    this.showNotify(message, null);
  }

  public openDialog(optionElement: IEvent): void {
    this.search = '';
    this.dialog.open(DialogComponent, {
      data: {
        nameSurname: optionElement.nameSurname,
        department: optionElement.department,
        event: optionElement.event,
        theme: optionElement.theme,
        text: optionElement.text,
        file: optionElement.file,
        date: optionElement.date,
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}
