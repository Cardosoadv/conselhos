<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Migration para criação da tabela de dados complementares dos usuários.
 */
class CreateUsersDadosTable extends Migration
{
    /**
     * Cria a tabela 'users_dados'.
     *
     * @return void
     */
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'nome' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'cpf' => [
                'type'       => 'VARCHAR',
                'constraint' => '14',
                'null'       => true,
            ],
            'data_nascimento' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'telefone' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
            'cep' => [
                'type'       => 'VARCHAR',
                'constraint' => '9',
                'null'       => true,
            ],
            'logradouro' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
            ],
            'numero' => [
                'type'       => 'VARCHAR',
                'constraint' => '20',
                'null'       => true,
            ],
            'bairro' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
            ],
            'cidade' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
            ],
            'estado' => [
                'type'       => 'VARCHAR',
                'constraint' => '2',
                'null'       => true,
            ],
            'imagem' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
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
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('users_dados');
    }

    /**
     * Remove a tabela 'users_dados'.
     *
     * @return void
     */
    public function down()
    {
        $this->forge->dropTable('users_dados');
    }
}
