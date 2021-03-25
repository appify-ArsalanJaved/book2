import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { IWorker, workers } from './workers';
import { departs, IDepartment } from './departments';
import { tap , filter, scan } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visible = true;
  selectable = true;
  removable = true;
  isDepart = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<IDepartment[]>;

  filteredDepartments: Observable<IDepartment[]>;
  departmentsSave: IDepartment[] = [];
  filteredWorkers: Observable<IWorker[]>;

  fruits: string[] = [];
  companyEmployees: Observable<number[]>;
  companyEmployeesAll: Observable<number[]>;
  allFruits: IDepartment[] = departs;


  public workers: IWorker[] = workers;
  public departs: IDepartment[] = departs;

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: IDepartment | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
    }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.departmentsSave.splice(index, 1);
      this.filteredDepartments = of(this.departmentsSave);
    }
    if(this.fruits.length == 0){
      this.isDepart = false;
    }
    this.refreshEmpls();
  }

  refreshEmpls(): void {
    this.filteredDepartments = of(this.departmentsSave);
      this.companyEmployees = this.filteredDepartments.pipe(
        map((departments: IDepartment[]): number[] => {
          const employees: number[] = [];
          for (const dept of departments) {
            employees.push(...dept.employees); // Could this be null? could it have duplicates?
          }
          return employees;
        })
      );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if(!this.fruits.some(s => s.includes(event.option.viewValue))){
      this.fruits.push(event.option.viewValue);
      this.departmentsSave.push(event.option.value);
      this.fruitInput.nativeElement.value = '';
      this.isDepart = true;
      this.fruitCtrl.setValue(null);
      this.refreshEmpls();
    }
  }

  private _filter(value: IDepartment): IDepartment[] {
    const filterValue = value.name.toLowerCase();
    return this.allFruits.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
