<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UserImg extends Migration
{
    public function up()
    {
        // Users Table
        $this->forge->addField([
            'id'             => ['type' => 'int', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'img'            => ['type' => 'varchar', 'constraint' => 60, 'null' => true],
            'created_at'     => ['type' => 'datetime', 'null' => true],
            'updated_at'     => ['type' => 'datetime', 'null' => true],
            'deleted_at'     => ['type' => 'datetime', 'null' => true],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->createTable('auth_imgs');
    }

    public function down()
    {
        //
    }
}
