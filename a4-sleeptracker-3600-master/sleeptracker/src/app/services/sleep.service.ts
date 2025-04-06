import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Storage } from '@ionic/storage-angular'



@Injectable({
  providedIn: 'root'

})
export class SleepService {
  private static LoadDefaultData:boolean = true;
  public static AllSleepData:SleepData[] = [];
  public static AllOvernightData:OvernightSleepData[] = [];
  public static AllSleepinessData:StanfordSleepinessData[] = [];
  private storageReady = false;


  public initPromise: Promise<void>;

  constructor(private storage: Storage ) {
    this.initPromise = this.initStorage();
    if(!SleepService.LoadDefaultData) {
      // this.addDefaultData();
      SleepService.LoadDefaultData = false;
    }


  }

  async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    await this.loadStoredData();

    if (SleepService.LoadDefaultData &&
      SleepService.AllOvernightData.length == 0 &&
      SleepService.AllSleepinessData.length == 0) {
      this.addDefaultData()
      SleepService.LoadDefaultData = false;
      await this.saveData();
    }
  }

  private addDefaultData() {
    var goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
    goToBed.setHours(1, 3, 0); //1:03am
    var wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
    this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
    var sleepinessDate = new Date();
    sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
    sleepinessDate.setHours(14, 38, 0); //2:38pm
    this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
    goToBed = new Date();
    goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
    goToBed.setHours(23, 11, 0); //11:11pm
    wakeUp = new Date();
    wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
    this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
  }

  public async logOvernightData(sleepData:OvernightSleepData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllOvernightData.push(sleepData);
    await this.saveData()
  }

  public async logSleepinessData(sleepData:StanfordSleepinessData) {
    SleepService.AllSleepData.push(sleepData);
    SleepService.AllSleepinessData.push(sleepData);
    await this.saveData();
  }

  async loadStoredData() {
    const overnightData = await this.storage.get('overnightData');
    if (overnightData) {
      SleepService.AllOvernightData = (overnightData as any[]).map(item => {
        const instance = new OvernightSleepData(new Date(item.sleepStart), new Date(item.sleepEnd));
        Object.assign(instance, item);
        return instance;
      });
    }
    const sleepinessData = await this.storage.get('sleepinessData');
    if (sleepinessData) {
      SleepService.AllSleepinessData = (sleepinessData as any[]).map(item => {
        const instance = new StanfordSleepinessData(item.loggedValue, new Date(item.loggedAt));
        Object.assign(instance, item);
        return instance;
      });

      console.log(SleepService.AllOvernightData)
      console.log(SleepService.AllSleepinessData)
    }
  }



  public async deleteOvernightData(id: string){
    SleepService.AllOvernightData = SleepService.AllOvernightData.filter(item => item.id !== id);
  await this.saveData();
  }

  public async deleteSleepinessData(id: string){
    SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(item => item.id !== id);
    await this.saveData();
  }

  async saveData() {
    if (this.storageReady && this.storage) {
      await this.storage.set('overnightData', SleepService.AllOvernightData);
      await this.storage.set('sleepinessData', SleepService.AllSleepinessData);
    }
  }
}
