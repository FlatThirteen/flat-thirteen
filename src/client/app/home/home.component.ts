import { Component, OnInit } from '@angular/core';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {

  /**
   * Creates an instance of the HomeComponent.
   */
  constructor() {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {

  }
}
