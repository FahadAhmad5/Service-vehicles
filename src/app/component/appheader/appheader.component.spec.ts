import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppheaderComponent } from './appheader.component';

describe('AppheaderComponent', () => {
  let component: AppheaderComponent;
  let fixture: ComponentFixture<AppheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppheaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
