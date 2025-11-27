<?php

namespace App\Controllers;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\ControllerTestTrait;
use CodeIgniter\Test\DatabaseTestTrait;

class ConselhoTest extends CIUnitTestCase
{
    use ControllerTestTrait;
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $migrateOnce = false;
    protected $refresh = true;
    protected $namespace = null;

    public function testIndexDisplaysCouncils()
    {
        // Insert a dummy council
        $model = new \App\Models\ConselhoModel();
        $model->insert([
            'nome' => 'Conselho Teste',
            'sigla' => 'CT',
        ]);

        $result = $this->controller(\App\Controllers\Conselho::class)
                       ->execute('index');

        $result->assertOK();

        // This assertion checks if 'Conselho Teste' is present in the response body.
        // If the bug exists, the view will say "Nenhum conselho encontrado." even if we inserted one.
        // But because it's a view loop, if the variable is missing/wrong, it might not print the list.
        $result->assertSee('Conselho Teste', 'div', 'The council name was not found in the output.');
        $result->assertDontSee('Nenhum conselho encontrado.');
    }
}
