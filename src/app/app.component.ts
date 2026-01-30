import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { AppService } from './app.service';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Locacao } from './model/locacao';
import { AppModalComponent } from './pages/app-modal.component';
import { da, tr } from 'date-fns/locale';
import { TokenModalComponent } from './pages/token-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;
  
  view: CalendarView = CalendarView.Month;
  
  modalData: { event: CalendarEvent<any> } | null = null;
  
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = true;
  eventoClicado: boolean = false;
  viewDate: Date = new Date();
  refresh: Subject<void> = new Subject();
  events: CalendarEvent[] = [];
  
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edit',event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Delete', event);
      },
    },
  ];
  
  constructor(private appService: AppService,
    private toastr: ToastrService,
    private modal: NgbModal
  ){
    
  }
  
  
  ngOnInit(): void {
    

    const token = localStorage.getItem('token');

    if (!token) {
      // Abre a modal pedindo o token
      const modalRef = this.modal.open(TokenModalComponent, {
        backdrop: 'static',
        keyboard: false
      });

      modalRef.result.then((tokenInserido: string) => {
        if (tokenInserido) {
          localStorage.setItem('token', tokenInserido);
        }
      });
    }else{
      this.loadDados();
    }
  }
  
  handleEvent(action: string, event: CalendarEvent) {
    this.eventoClicado = true;
    
    const modalRef = this.modal.open(AppModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.event = event; // 👈 passa o evento como input
    modalRef.result
    .then((result) => {
      console.log('Modal fechada com sucesso', result);
      this.eventoClicado = false;
    })
    .catch((reason) => {
      console.log('Modal descartada', reason);
    });
    
  }
  
  onDayClicked(event: any): void {
    
    const day = event.day; // tipo “any” ou inferido
    const date: Date = day.date;
    const events = day.events as CalendarEvent<any>[];
    if (this.eventoClicado == false){
      const modalRef = this.modal.open(AppModalComponent, { size: 'lg', centered: true, backdrop: 'static' });
      modalRef.componentInstance.event = event; 
      modalRef.result.then(result => {
        this.loadDados();
      }).catch(() => {});
    }
    
  }
  
  abrirModal() {
    const modalRef = this.modal.open(AppModalComponent, { size: 'lg', centered: true, backdrop: 'static' });
    
    modalRef.result.then(result => {
      
      if (result) {
        // Atualizar calendário ou salvar dados
      }
    }).catch(() => {});
  }
  
  loadEvents(dataInicial: string, dataFinal: string){
    this.appService.getCalendarView(dataInicial,dataFinal).subscribe(data => {
      this.events = [];
      console.log(data)
      this.events = data.map((evento: { start: string | number | Date; end: string | number | Date; title: string, status: string; clienteFull: string; equipamentoFull: string; motoristaRecolhe: string; motoristaEntrega: string; color: string; cellPhone: string; endereco: string, calendarId: string }): CalendarEvent<Locacao> => {
        let color_;
        
        color_ = { primary: evento.color, secondary: '#D2E3FC' }; // confirmada
        
        return {
          ...evento,
          start: new Date(evento.start),
          end: new Date(evento.end),
          title: evento.title,
          color: color_,
          id: evento.calendarId,
          meta: {
            status: evento.status == '1' ? 'Confirmada' : 'Pendente',
            clienteFull: evento.clienteFull,
            cellPhone: evento.cellPhone,
            equipamentoFull: evento.equipamentoFull,
            motoristaRecolhe: evento.motoristaRecolhe,
            motoristaEntrega: evento.motoristaEntrega,
            endereco: evento.endereco
          }
        };
      });
    },
    (error: any) =>{
      this.toastr.error(error.error)
      
      if (error.error.includes('expirado') || error.error.includes('permissão')){
        localStorage.removeItem('token');
      }

      console.log(error.error)
    }
    
  );
    
  }
  
  closeOpenMonthViewDay(event: any) {
    
    const data = new Date(event);
    const ultimoDia = endOfMonth(data);
    
    const ultimoDiaFormatado = format(ultimoDia, 'yyyy-MM-dd'); 
    
    // 2 - pegar primeiro dia do mês
    const primeiroDia = startOfMonth(data);
    const primeiroFormatado = format(primeiroDia, 'yyyy-MM-dd');
    this.loadEvents(primeiroFormatado,ultimoDiaFormatado);
    this.activeDayIsOpen = false;
  }

  loadDados(){
    const data = new Date();
    const ultimoDia = endOfMonth(data);
    const ultimoDiaFormatado = format(ultimoDia, 'yyyy-MM-dd'); 
    
    // 2 - pegar primeiro dia do mês
    const primeiroDia = startOfMonth(data);
    const primeiroFormatado = format(primeiroDia, 'yyyy-MM-dd');
    this.loadEvents(primeiroFormatado,ultimoDiaFormatado);
  }
}
