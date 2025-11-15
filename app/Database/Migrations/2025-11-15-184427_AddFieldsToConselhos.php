<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldsToConselhos extends Migration
{
    public function up()
    {
        $this->forge->addColumn('conselhos', [
            'sistema_profissoes' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'after'      => 'sigla',
            ],
            'site' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'after'      => 'sistema_profissoes',
            ],
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'after'      => 'site',
            ],
            'logradouro' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'after'      => 'email',
            ],
            'numero' => [
                'type'       => 'VARCHAR',
                'constraint' => '10',
                'null'       => true,
                'after'      => 'logradouro',
            ],
            'bairro' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
                'after'      => 'numero',
            ],
            'cidade' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
                'after'      => 'bairro',
            ],
            'estado' => [
                'type'       => 'VARCHAR',
                'constraint' => '2',
                'null'       => true,
                'after'      => 'cidade',
            ],
            'cep' => [
                'type'       => 'VARCHAR',
                'constraint' => '8',
                'null'       => true,
                'after'      => 'estado',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('conselhos', 'sistema_profissoes');
        $this->forge->dropColumn('conselhos', 'site');
        $this->forge->dropColumn('conselhos', 'email');
        $this->forge->dropColumn('conselhos', 'logradouro');
        $this->forge->dropColumn('conselhos', 'numero');
        $this->forge->dropColumn('conselhos', 'bairro');
        $this->forge->dropColumn('conselhos', 'cidade');
        $this->forge->dropColumn('conselhos', 'estado');
        $this->forge->dropColumn('conselhos', 'cep');
    }
}
