import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { IWorker, workers } from './workers';
import { departs, IDepartment } from './departments';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  IsThisWeek =false;
  IsThisMonth =false;
  selected_departments=[];
  Departments = [];

  Employees=[];

  Filtered_Employees =[];
  constructor( private http: HttpClient,) {}

  ngOnInit(): void {
    
    this.getEmployees();
    this.getDepartments();
    
  }

  getEmployees(){

    this.http.get(environment.api_url+"/employees").subscribe((data:any) => {
      this.Employees = data;
      this.Filtered_Employees = this.Employees;
    } );
  }

  getDepartments(){

    this.http.get(environment.api_url+"/departments").subscribe((data:any) => this.Departments = data );
  }


  filter(){

    if(!this.IsThisMonth && !this.IsThisWeek && this.selected_departments.length<=0)
       this.Filtered_Employees = this.Employees;
    else{

      this.Filtered_Employees = [];
      if(this.selected_departments.length>0){
        this.selected_departments.forEach(dept => {
          var filtered =  this.Employees.filter(p=> dept.employeeIds.indexOf(p.id)>=0); 
          this.Filtered_Employees.push(...filtered);
        });
      }
      else{
        this.Filtered_Employees = this.Employees;
      }

      if(this.IsThisWeek){
        this.Filtered_Employees = this.Filtered_Employees.filter(p=>this.isDateInThisWeek(p.birthday)==true);
      }

      if(this.IsThisMonth){
        this.Filtered_Employees = this.Filtered_Employees.filter(p=>this.isDateInThisMonth(p.birthday)==true);
      }
    }
  }


  isDateInThisWeek(date) {
    date =  new Date(date);
    const todayObj = new Date();
    const todayDate = todayObj.getDate();
    const todayDay = todayObj.getDay();
  
    // get first date of week
    const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));
  
    // get last date of week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  
    date.setFullYear(lastDayOfWeek.getFullYear());
    // if date is equal or within the first and last dates of the week
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }

  isDateInThisMonth(date) {
    date =  new Date(date);
    const todayObj = new Date();
    return todayObj.getMonth() == date.getMonth();
  }

}
