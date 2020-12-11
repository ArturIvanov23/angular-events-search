import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RestService} from '../../services/rest.service';
import {Subscription} from 'rxjs';
import {IEvent, DialogData} from '../../types';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  eventsForm = this.fb.group({
    nameSurname: [null, Validators.required],
    department: [null, Validators.required],
    event: [null, Validators.required],
    theme: [null, Validators.required],
    text: null,
    file: [null, Validators.required],
    date: [new Date().toLocaleString(), Validators.required]
  });

  public search = '';

  events: IEvent[] = [];

  hasUnitNumber = false;

  eventCategories = [
    {name: 'Событие 1', abbreviation: '1'},
    {name: 'Событие 2', abbreviation: '2'},
    {name: 'Событие 3', abbreviation: '3'}
  ];
  getEvents: any;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar,
              private restService: RestService, public dialog: MatDialog) {}

  public get searched(): IEvent[] {
    if (this.search.length >= 3) {
      return this.events.filter(item => item.theme && item.theme.includes(this.search));
    } else {
      return this.events.filter(item => item.theme);
    }
  }

  private showNotify(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public onChange(event): void {
    this.search = event.target.value;
  }

  public onSubmit(): void {
    this.restService.sendEvent(this.eventsForm.getRawValue());
  }

  public onClear(): void {
    this.eventsForm.reset();
    this.eventsForm.patchValue({ date: new Date().toLocaleString() });
    this.showNotify('Форма очищена', null);
  }

  public openDialog(optionElement: IEvent): void {
    this.dialog.open(DialogComponent, {
      data: {
        nameSurname: optionElement.nameSurname,
        department: optionElement.department,
        event: optionElement.event,
        theme: optionElement.theme,
        text: optionElement.text,
      }
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.restService.getEvents().subscribe((events: IEvent[]) => {
        this.events = events;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
