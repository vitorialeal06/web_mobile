import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonText, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../core/services/auth.service';
//import { Storage} from '@ionic/storage-angular'; aula 
//import {Usuario} from './usuario.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonButton, IonText, IonSpinner,
  ],
  providers: [Storage],
})
export class HomePage {

  //public instancia: { username: string; password: string } = {
    //username: '',
    //password: ''
   // }; // aula

  username = '';
  password = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    //public storage: Storage, aula
    //public controle_caregamento: LoadingController
    //public controle_navegacao: NavController
    //public controle_alerta: AlertController
    //public controle_toast: ToastController  
  ) {}

  /*
  asysnc ngOnInit() {
    await this.storage.create(); aula 
  }

  asysnc autenticarUsuario(){
    const loading = await this.controle_caregamento.create({message: 'Autenticando...'});
    await loading.present();
  }

  const options: HttpOptions = {
    headers: {'Content-Type': 'application/json'},
    url: 'https://127.0.0.1:8000/api/autenticacao-api/',
    data: this.instancia
  };

  autentica usuario junto a api do sistema web
  CapacitorHttp.post(options)
  .then(asysnc (resposta: HttpResponse) => {
    if(resposta.status ==200){
    let usuario: Usuario = Obejct.assign(new Usuario(), resposta.data);
    loading.dismiss();
    thins.controle_navegacao.navigateRoot('/veiculos');
    }
    else{
      loading.dismiss();
      this.apresenta_mensage,(resposta.status)
    }
  })
    .catch(async (erro:any) => {
      console.log(erro);
      loaging.dismiss();
      this.apresenta_mensage(erro?.status);
    }

  async apresenta_mensage(codigo: number){
    const mensagem = await this.controle_toast.create({
    message: 'falha na autenticação, código: ${codigo}',
    cssClass: 'ion-text-center',
    duration: 3000
    });
    mensagem.present();
  }
    
  
*/


  async login() {
    if (!this.username || !this.password) {
      await this.mostrarErro('Preencha usuário e senha.');
      return;
    }

    this.carregando = true;

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/veiculos']);
      },
      error: (erro) => {
        this.carregando = false;
        if (erro.status === 400) {
          this.mostrarErro('Usuário ou senha inválidos.');
        } else {
          this.mostrarErro('Erro ao conectar com o servidor.');
        }
      },
    });
  }

  async mostrarErro(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
    await toast.present();
  }

  forgotPassword() {}
  goToRegister() {}
}