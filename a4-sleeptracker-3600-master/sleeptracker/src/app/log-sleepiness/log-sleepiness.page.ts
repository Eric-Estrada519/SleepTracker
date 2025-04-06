import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from "@ionic/angular";
import {SleepService} from "../services/sleep.service";
import {StanfordSleepinessData} from "../data/stanford-sleepiness-data";
import { addOutline } from 'ionicons/icons';
import {addIcons} from "ionicons";

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: './log-sleepiness.page.html',
  styleUrls: ['./log-sleepiness.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule]
})
export class LogSleepinessPage implements OnInit {
  public slider = 1;
  public successMes = "";
  private sleepService: SleepService;

  constructor(sleepService: SleepService,) {
    this.sleepService = sleepService;
    addIcons({addOutline})
  }

  slideChange(ev: Event) {
    this.slider = (ev as CustomEvent).detail.value as number;
  }

  getSleepinessValue():string {
    return StanfordSleepinessData.ScaleValues[this.slider - 1];
  }
  clearMes(): void {
    this.successMes = "";
  }

  logSleepiness() {
    const sleepinessDate = new StanfordSleepinessData(this.slider);
    this.sleepService.logSleepinessData(sleepinessDate);

    this.successMes = "Sleepiness Logged";
  }

  currentTime() {
    var date = new Date();
    var hh: string | number = date.getHours();
    var mm: string | number = date.getMinutes();

    var w = ""

    if (hh < 12) w = 'AM';
    else w = "PM";

    if (hh == 12) hh = 12;
    else  hh = hh % 12;

    hh = hh < 10 ? '0'+hh : hh;
    mm = mm < 10 ? '0'+mm : mm;

    return hh + ":" + mm + " " + w;
  }

  ngOnInit() {
  }

}
