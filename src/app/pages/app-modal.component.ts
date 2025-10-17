import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';
import { da } from 'date-fns/locale';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-modal',
    templateUrl: 'app-modal.component.html',
    styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent implements OnInit {
    form!: FormGroup;
    @Input() event: any;
    locatarios: any[] = [];
    equipamentos: any[] = [];
    ponteiras: any[] = [];
    locacao: any;
    bloquear: boolean = false;
    
    
    constructor(public activeModal: NgbActiveModal, 
        private fb: FormBuilder,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private appService: AppService) {}
        
        ngOnInit(): void {
            this.loadClients();
            this.loadEquipment();
            this.loadSpecifications();
            this.createForm();
        }
        
        createForm(): void {
            
            this.form = this.fb.group({
                id: [ '', Validators.required],
                clientId: [ '', Validators.required],
                active: [true],
                equipamentId: ['', Validators.required],
                ponteiras: [''],
                status: ['2'],
                date: ['', Validators.required],
                startTime1: ['', Validators.required],
                endTime1: ['', Validators.required],
                calendarSpecifications:  this.formBuilder.array([]),

            });
            
            this.form.get('ponteiras')?.disable();
            let hoje = new Date();
            
            if (this.event?.day){
                hoje = this.event.day.date
            }
            
            
            if (this.event === undefined || this.event.day){
                const _hoje = new Date();
                
                this.form.patchValue({
                    date: hoje.toISOString().split('T')[0],
                    startTime1: '08:00',
                    endTime1: '18:00'
                });
                
                hoje.setHours(0, 0, 0, 0); // zera a hora
                _hoje.setHours(0, 0, 0, 0); 
                
                if (hoje < _hoje){
                    // Desabilitar TODOS os campos
                    this.form.disable();
                    this.bloquear = true;
                }
                
                return
            }
            
            this.appService.loadCalendarById(this.event.calendarId).subscribe(dados => {
                
                if (dados) {
                    
                    const data = new Date(dados.date);
                    const inicio = dados.startTime.split("T")[1].slice(0, 5);
                    const fim = dados.endTime.split("T")[1].slice(0, 5);
                    
                    this.form.patchValue({
                        id: dados.id,
                        clientId: dados.clientId,
                        equipamentId: dados.equipamentId,
                        status: dados.status,
                        date: data.toISOString().split('T')[0],
                        startTime1: inicio,
                        endTime1: fim
                    });
                    
                    // Comparar com a data atual
                    
                    hoje.setHours(0, 0, 0, 0); 
                    data.setHours(0, 0, 0, 0); 
                    
                    if (data >= hoje) {
                        // Desabilitar só locatario e equipamento
                        this.form.get('clientId')?.disable();
                        this.form.get('equipamentId')?.disable();
                    } else {
                        // Desabilitar TODOS os campos
                        this.form.disable();
                    }
                }
            });
        }
        
        onNoClick(): void {
            this.activeModal.close();
        }
        
        onSubmit(){
            if (this.form.value.id === "" || this.form.value.id === undefined){
                
                this.appService.save(this.form.value).subscribe((resp: any) => {
                    this.toastr.success('Locação criada com sucesso.');
                    this.activeModal.close(resp);
                },
                (error: any) =>{
                    
                    this.toastr.warning(error.error?.errorMessage)
                });
            } else {
                // if (this.form.value.date < this.todayDate){
                //     this.toastr.warning("Essa locação não pode ser alterada.")
                // }
                this.appService.update(this.form.value).subscribe((resp: any) => {
                    this.toastr.success('Locação atualizada com sucesso!');
                    this.activeModal.close(resp);
                },
                (error: any) =>{
                    this.toastr.warning(error.error?.errorMessage)
                }
            );
        }
    }
    
    maskPhone(value: string): string {
        
        if (value === undefined)
            return ''
        
        return value
        .replace(/\D/g, '') // remove tudo que não é dígito
        .replace(/^(\d{2})(\d)/, '($1) $2') // coloca parênteses no DDD
        .replace(/(\d{5})(\d{4})$/, '$1-$2'); // coloca o traço
    }
    
    loadClients(){
        this.appService.getClients(true,'').subscribe(data => {
            this.locatarios = data;
        });
    }
    
    loadEquipment(): void{
        this.appService.loadEquipment(true).subscribe(data => {
            this.equipamentos = data;
        });
    }
    
    loadLocacaoById(id: string){
        this.appService.loadCalendarById(id).subscribe(data => {
            this.locacao = data;
            console.log(this.locacao)
        });
    }
    
    loadSpecifications(): void{
        this.appService.loadSpecifications().subscribe(data => {
            this.ponteiras = data;
        });
    }
    
}
