import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Alert } from './alert.model';
import { AlertService } from './alert.service';
import { AlertSettings } from './alert-settings';

@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['./alert.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription | undefined;
  routeSubscription: Subscription | undefined;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        if (!alert.message) {
          this.alerts = [];
          return;
        }

        this.alerts.push(alert);

        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      }
    );

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.alertSubscription != undefined)
      this.alertSubscription.unsubscribe();

    if(this.routeSubscription != undefined)
      this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      let matchingAlert = this.alerts.find(x => x === alert);
     if(matchingAlert != undefined)
       matchingAlert.fade = true;

      setTimeout(() => {
          this.alerts = this.alerts.filter(x => x !== alert);
      }, 250);
    } else {
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ['alert', 'alert-dismissable'];
                
    const alertTypeClass = {
      [AlertSettings.SUCCESS]: 'alert alert-success',
      [AlertSettings.ERROR]: 'alert alert-danger',
      [AlertSettings.INFO]: 'alert alert-info',
      [AlertSettings.WARNING]: 'alert alert-warning'
    }

    classes.push(alertTypeClass[alert.alertType]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}