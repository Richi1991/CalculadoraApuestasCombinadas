import { Component, OnInit } from '@angular/core';
import { Sistema } from '../model/sistema';
import { Cuota } from '../model/cuota';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { textSpanIntersectsWithTextSpan } from 'typescript';

@Component({
  selector: 'app-mat-form',
  templateUrl: './mat-form.component.html',
  styleUrls: ['./mat-form.component.css']
})
export class MatFormComponent implements OnInit {

  sistemas: Sistema[] = [
    {valorInferior: 2, valorSuperior: 3, viewValue: '2 de 3'},
    {valorInferior: 2, valorSuperior: 4, viewValue: '2 de 4'},
    {valorInferior: 2, valorSuperior: 5, viewValue: '2 de 5'},
    {valorInferior: 3, valorSuperior: 4, viewValue: '3 de 4'},
    {valorInferior: 3, valorSuperior: 5, viewValue: '3 de 5'},
    {valorInferior: 3, valorSuperior: 6, viewValue: '3 de 6'},
    {valorInferior: 4, valorSuperior: 5, viewValue: '4 de 5'},
    {valorInferior: 4, valorSuperior: 6, viewValue: '4 de 6'},
    {valorInferior: 4, valorSuperior: 7, viewValue: '4 de 7'},
    {valorInferior: 5, valorSuperior: 6, viewValue: '5 de 6'},
    {valorInferior: 5, valorSuperior: 7, viewValue: '5 de 7'},
    {valorInferior: 6, valorSuperior: 7, viewValue: '6 de 7'},
    {valorInferior: 6, valorSuperior: 8, viewValue: '6 de 8'},
    {valorInferior: 6, valorSuperior: 9, viewValue: '6 de 9'},
    {valorInferior: 7, valorSuperior: 8, viewValue: '7 de 8'},
    {valorInferior: 7, valorSuperior: 9, viewValue: '7 de 9'},
    {valorInferior: 7, valorSuperior: 10, viewValue: '7 de 10'}
  ];

  //Cuota lista
  cuotaList: Array<Cuota> = [];
  
  //Cuota Final calculada de multiplicar todas las cuotas
  cuotaFinal = 1;

  //Boolean que muestra la tabla de resultados de apuestas combinadas
  mostrarTablaResultadosCombinada = false;

  //Importe de apuesta modificable
  importeApuesta = 1;

  //Numero de filas de cuotas de apuestas
  numeroFilas = 3;

  //Array del número de filas con el resultado
  numeroCombinacionesList: Number[] = [];
  
  //Array del número de columnas con el resultado
  numeroColumnasResultadoList: Number[] = [];

  //Lista con los valores de ganancias por apuestas combinadas
  resultadoCombinadasList: number[] = [];

  //Valor editable tanto de cuota como de importe de la apuesta
  editField: number = 0;

  //Sistema Mínimo que se inicia por defecto
  sistemaMinimo = 2;

  //Sistema Máximo que se inicia por defecto
  sistemaMaximo = 3;

  //Descripción del sistema de apuestas combinadas elegido
  sistemaDescripcion: string = '2 de 3';

  //Ganancia total de la apuesta combinada sin tener en cuenta el importe gastado
  gananciaTotalCombinada: number = 0;

  //Ganancia total de la apuesta combinada restando el importe que nos hemos gastado
  gananciaTotalSinImporte: number = 0;

  constructor() { }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////METODOS/////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ngOnInit(): void {
    for(let i = 0; i < this.numeroFilas; i++) {
      let cuotaObject = new Cuota((i + 1), 2);
      this.cuotaList.push(cuotaObject);
    }
  }

  /**
   * Obtiene el sistema de apuestas que hemos elegido
   * @param valorInferior 
   * @param valorSuperior 
   * @param viewValue 
   */
  obtenerSistema(valorInferior: number, valorSuperior: number, viewValue: string) {
    this.mostrarTablaResultadosCombinada = false;
    this.sistemaMinimo = valorInferior;
    this.sistemaMaximo = valorSuperior;
    this.cuotaFinal = 0;
    this.cuotaList =  [];
    this.sistemaDescripcion = viewValue;
    for(let i = 0; i < valorSuperior; i++) {
      let cuotaObject = new Cuota((i + 1), 2);
      this.cuotaList.push(cuotaObject);
    }
  }

  /**
   * Cambia el valor del importe de la apuesta o de una cuota
   * @param event 
   */
  cambiarValor(event: any) {
    this.editField = event.target.textContent;
  }

  /**
   * Actualiza el valor de una cuota
   * @param id 
   * @param event 
   */
  actualizarCuotas(id:number, event: any) {
    const editField = event.target.textContent;
    let cuotaId = this.cuotaList.findIndex((obj => obj.id == id));
    this.cuotaList[cuotaId].valor = editField;
  }

  /**
   * Actualiza el importe de la apuesta
   * @param event
   */
  actualizarImporte(event: any) {
    const editField = event.target.textContent;
    this.importeApuesta = editField;
  }

  /**
   * Calcula la ganancia de una apuesta simple
   */
  calcularGananciaSimple() {
    this.cuotaFinal = 1;
    for(let i = 0; i < this.cuotaList.length; i++) {
      this.cuotaFinal = this.cuotaFinal * this.cuotaList[i].valor;  
    }
    this.cuotaFinal = parseFloat(this.cuotaFinal.toLocaleString(undefined, { maximumFractionDigits: 2 })) * this.importeApuesta;  
  }


  productoRangos(a: number, b: number) {
    let prd = a, i = a;
    while(i++<b) {
      prd*=i;
    }
    return prd;
  }

  /**
   * Calcula el número máximo de combinaciones
   * posibles en una apuesta combinada
   */
  calcularCombinaciones() {
    let numeroFilasResultado = 0;
    this.numeroCombinacionesList = [];
    this.numeroColumnasResultadoList = [];
    this.mostrarTablaResultadosCombinada = true;
    let r = this.sistemaMinimo;
    let n = this.sistemaMaximo;
    r = (r < n-r) ? n - r : r;
    numeroFilasResultado = this.productoRangos(r + 1, n) / this.productoRangos(1, n - r); 
    for(let x = 0; x < this.sistemaMinimo; x++) {
      this.numeroColumnasResultadoList.push(x+1);
    }

    for(let i = 0; i < numeroFilasResultado; i++) {
      this.numeroCombinacionesList.push(i+1);
    }
    this.calcularGananciaAcumulada();
  }

  /**
   * Metodo que calcula la ganancia acumulada de los distintos sistemas de apuestas
   */
  calcularGananciaAcumulada () {
    this.calcularGananciaSimple();
    this.resultadoCombinadasList = [];
    let listaValoresCuotas = [];
    let listaGananciasSinDividir = [];
    for (let i = 0; i < this.sistemaMaximo; i ++) {
      listaValoresCuotas.push(this.cuotaList[i].valor);
    }
    const n = this.sistemaMinimo;
    const buildCombinations = (listaValoresCuotas: any, num: number) => {
      const res = [];
      let temp, i, j, max = 1 << listaValoresCuotas.length;
      for(i = 0; i < max; i++){
        temp = [];
        for(j = 0; j < listaValoresCuotas.length; j++){
          if (i & 1 << j){
            temp.push(listaValoresCuotas[j]);
          };
        };
        if(temp.length === num){
          res.push(temp.reduce(function (a, b) {
            return (a * b);
          }));
        };
      };
      return res;
    }
    listaGananciasSinDividir = buildCombinations(listaValoresCuotas, n);
    console.log('listaGananciasSinDividir: ' + listaGananciasSinDividir);
    for(let i = 0; i < listaGananciasSinDividir.length; i++) {
      let gananciaCombinada = parseFloat((((listaGananciasSinDividir[i]) * this.importeApuesta) /this.numeroCombinacionesList.length)
        .toLocaleString(undefined, { maximumFractionDigits: 2 }));
      this.resultadoCombinadasList.push(gananciaCombinada);
    }
    this.gananciaTotalCombinada = parseFloat(this.resultadoCombinadasList.reduce((a, b) => a + b, 0)
      .toLocaleString(undefined, { maximumFractionDigits: 2 }));
    this.gananciaTotalSinImporte = this.gananciaTotalCombinada - this.importeApuesta;
  }

}
