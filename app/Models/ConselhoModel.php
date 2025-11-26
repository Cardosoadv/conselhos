<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * Modelo responsável pela interação com a tabela de conselhos.
 */
/**
 * Modelo responsável pela interação com a tabela de conselhos.
 */
class ConselhoModel extends Model
{
    /**
     * Nome da tabela no banco de dados.
     *
     * @var string
     */
    protected $table            = 'conselhos';

    /**
     * Chave primária da tabela.
     *
     * @var string
     */
    protected $primaryKey       = 'id';

    /**
     * Define se a chave primária é auto-incrementável.
     *
     * @var bool
     */
    protected $useAutoIncrement = true;

    /**
     * Tipo de retorno dos dados (array ou object).
     *
     * @var string
     */
    protected $returnType       = 'array';

    /**
     * Define se deve usar Soft Deletes (exclusão lógica).
     *
     * @var bool
     */
    protected $useSoftDeletes   = true;

    /**
     * Define se os campos devem ser protegidos contra inserção em massa.
     *
     * @var bool
     */
    protected $protectFields    = true;

    /**
     * Campos permitidos para inserção/atualização.
     *
     * @var array
     */
    protected $allowedFields    = [
        'nome',
        'sigla',
        'sistema_profissoes',
        'site',
        'email',
        'logradouro',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'cep'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [];
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];
}
