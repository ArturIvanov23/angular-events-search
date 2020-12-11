import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RestService} from '../../services/rest.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main-form',
  templateUrl: '../../../../../angular-events-search/src/app/main-form/main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent {
  eventsForm = this.fb.group({
    nameSurname: [null, Validators.required],
    department: [null, Validators.required],
    event: [null, Validators.required],
    theme: [null, Validators.required],
    text: null,
    file: [null, Validators.required],
    search: [null],
    date: [new Date().toLocaleString(), Validators.required]
  });

  hasUnitNumber = false;

  events = [
    {name: 'Событие 1', abbreviation: '1'},
    {name: 'Событие 2', abbreviation: '2'},
    {name: 'Событие 3', abbreviation: '3'}
  ];
  getEvents: any;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private restService: RestService, private http: HttpClient) {}

  private showNotify(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public onSubmit(): void {
    this.restService.sendEvent(this.eventsForm.getRawValue()).subscribe(items => console.log(items));
  }

  public onClear(): void {
    this.eventsForm.reset();
    this.eventsForm.patchValue({ date: new Date().toLocaleString() });
    this.showNotify('Форма очищена', null);
  }
}
