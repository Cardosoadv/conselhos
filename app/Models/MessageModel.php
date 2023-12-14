<?php

namespace App\Models;

use CodeIgniter\Model;

class SystemModel extends Model
{
	protected $DBGroup              = 'default';
	protected $table                = 'msg_messages';
	protected $primaryKey           = 'id';
	protected $useAutoIncrement     = true;
	protected $insertID             = 0;
	protected $returnType           = 'array';
	protected $useSoftDelete        = true;
	protected $protectFields        = true;
	protected $allowedFields        = [
		'message', 'sent_user', 'receive_user', 'read_at', 'created_at', 'updated_at', 'deleted_at'
	];
        
        
	// Dates
	protected $useTimestamps        = true;
	protected $dateFormat           = 'datetime';
	protected $createdField         = 'created_at';
	protected $updatedField         = 'updated_at';
	protected $deletedField         = 'deleted_at';

	// Validation
	protected $validationRules      = [];
	protected $validationMessages   = [];
	protected $skipValidation       = false;
	protected $cleanValidationRules = true;

	// Callbacks
	protected $allowCallbacks       = true;
	protected $beforeInsert         = [];
	protected $afterInsert          = [];
	protected $beforeUpdate         = [];
	protected $afterUpdate          = [];
	protected $beforeFind           = [];
	protected $afterFind            = [];
	protected $beforeDelete         = [];
	protected $afterDelete          = [];

	public function submenu($id){
        $builder = $this->db->table('sys_submenu s');
        $builder->where('menu_pai',$id);
        $query = $builder->get();
        return $query->getResultArray();
    }


	
}