<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateConselhosTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 5,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'nome' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'sigla' => [
                'type'       => 'VARCHAR',
                'constraint' => '10',
            ],
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
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('conselhos');
    }

    public function down()
    {
        $this->forge->dropTable('conselhos');
    }
}
