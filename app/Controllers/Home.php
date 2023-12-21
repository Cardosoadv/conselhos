<?php

namespace App\Controllers;
use App\Models\MessagesModel;

class Home extends BaseController
{
    public function index(): string
    {
        $data['module'] = "Sem modulo";
        return view('welcome_message',$data);
    }

    public function saveMessage(){

        $MessagesModel = new MessagesModel();
        $data = [
        'message' => $this->request->getVar('message'),
        'sent_user' => $this->request->getVar('sent_user'),
        'receive_user' => $this->request->getVar('receive_user'),
        ];    
        $MessagesModel->insert($data);
        return $this->response->redirect(site_url('admin'));
    }

    public function saveUserImg(){
        $data['img']= $this->request->getFile('foto-perfil');

    }

}
