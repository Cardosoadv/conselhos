<?php

namespace App\Validation;

use App\Traits\ValidarCpfTrait;

class CustomRules
{
    use ValidarCpfTrait;

    /**
     * Regra de validação customizada para CPF.
     *
     * @param string $str O valor do campo.
     * @param string|null $error Variável para retornar erro (opcional).
     * @return bool
     */
    public function valid_cpf(string $str, ?string &$error = null): bool
    {
        return $this->validaCpf($str);
    }
}
