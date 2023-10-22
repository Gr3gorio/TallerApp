import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleRecepcionPage } from './detalle-recepcion.page';

describe('DetalleRecepcionPage', () => {
  let component: DetalleRecepcionPage;
  let fixture: ComponentFixture<DetalleRecepcionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleRecepcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
