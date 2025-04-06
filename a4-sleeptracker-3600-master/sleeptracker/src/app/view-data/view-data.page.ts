import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from "@ionic/angular";
import { SleepService } from "../services/sleep.service";
import {StanfordSleepinessData} from "../data/stanford-sleepiness-data";
import { OvernightSleepData} from "../data/overnight-sleep-data";

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.page.html',
  styleUrls: ['./view-data.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})

export class ViewDataPage implements OnInit {
  overnightData: OvernightSleepData[] = [];
  sleepinessData: StanfordSleepinessData[] = [];

  constructor(private sleepService: SleepService) {}

  ngOnInit() {

    // gets the data from storage and puts it into the variables
    this.sleepService.initPromise.then(() => {
      this.overnightData = SleepService.AllOvernightData;
      this.sleepinessData = SleepService.AllSleepinessData;
      console.log('Overnight Data:', SleepService.AllOvernightData);
      console.log('Sleepiness Data:', SleepService.AllSleepinessData);
    });
  }
//deletes the overnight data chosen to delete
  deleteOvernight(id: string) {
    this.sleepService.deleteOvernightData(id).then(() => {
      this.overnightData = SleepService.AllOvernightData;
    })
  }
//deletes the sleepiness data chosen to delete
  deleteSleep(id: string) {
    this.sleepService.deleteSleepinessData(id).then(() => {
      this.sleepinessData = SleepService.AllSleepinessData;
    })
  }
}
