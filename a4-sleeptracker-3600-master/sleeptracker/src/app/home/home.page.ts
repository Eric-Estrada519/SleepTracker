import {Component, OnInit} from '@angular/core';
import { SleepService } from '../services/sleep.service';

import { OvernightSleepData } from '../data/overnight-sleep-data';

import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, NgIf],
})
export class HomePage implements OnInit{
  sleepStart: string= "";
  sleepEnd: string = "";

  errorMes= "";
  successMes= "";

  private dateTimeFormat: Intl.DateTimeFormatOptions = {
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
    timeZone:"America/Los_Angeles"
  };

  private sleepService: SleepService;

  constructor(sleepService:SleepService) {
    this.sleepService = sleepService;

    const now = new Date();
    this.sleepEnd = now.toISOString();

    now.setHours(now.getHours()- 8 );
    this.sleepStart = now.toISOString();
  }





  ngOnInit(): void {}

  formatDisplay(dateStr: string) {
    const date = new Date(dateStr);

    return new Intl.DateTimeFormat("en-US", this.dateTimeFormat).format(date);
  }


    findSleepDuration(): string {
    const sleepStartDate = new Date(this.sleepStart);
    const sleepEndDate = new Date(this.sleepEnd);

    const sleepDuration_ms = sleepEndDate.getTime() - sleepStartDate.getTime();

    const hours = Math.floor(sleepDuration_ms / ( 1000 * 60 * 60));

    const minutes = Math.floor(sleepDuration_ms % ( 1000 * 60 * 60)/ (1000 * 60));

    let result = "";

    if (hours > 0) {
      result += `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
      }

    if (minutes > 0) {
      if (result.length > 0) {
        result += " ";
      }
      result += `${minutes} ${minutes === 1 ? "Minute" : "Minutes"}`;
    }

    if (result ===  "") {
      result = "N/A";
      }
    return result;
}

  clearMes(): void {
    this.errorMes = "";
    this.successMes = "";
  }

    logOvernightSleep(): void {
      const sleepStartDate = new Date(this.sleepStart);
      const sleepEndDate = new Date(this.sleepEnd);
      const loggedAt = new Date();

      const sleepDuration = Math.abs(sleepEndDate.getTime() - sleepStartDate.getTime()) / 36e5;

      if (sleepStartDate > loggedAt || sleepEndDate > loggedAt) {
        this.errorMes = "Bedtime or wakeup is in the future not recent";
        return;
      } else if ( sleepStartDate >= sleepEndDate ) {
        this.errorMes = "Bedtime can't be earlier then wakeup";
        return;
      } else if ( sleepDuration > 24) {
        this.errorMes = "Sleep duration is over 24 hours";
        return;
      }

      this.sleepService.logOvernightData(new OvernightSleepData(sleepStartDate, sleepEndDate));
      this.successMes = "Input was successful";

    }
}
