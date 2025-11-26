<?php

/**
 * Lógica necessária ao funcionamento do menu lateral
 */

use App\Libraries\Permissions;

$uri = service('uri');
$active = $uri->getSegment(1);
$subActive = null;
$subActive2 = null;

if ($uri->getTotalSegments() >= 2) {
    $subActive = $uri->getSegment(2);
}

if ($uri->getTotalSegments() >= 3) {
    $subActive2 = $uri->getSegment(3);
}

$permitions = new Permissions();
$permission = $permitions->permission();

?>

<ul class="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu" data-accordion="false">
    <li class="nav-item">
        <a href="<?= site_url(); ?>" class="nav-link <?= ($active === null || $active === 'home') ? 'active bg-primary text-white shadow-sm' : ''; ?>">
            <i class="nav-icon fas fa-tachometer-alt"></i>
            <p>Home</p>
        </a>
    </li>

    <?php if (auth()->user()->can('usuarios.visualizar')): ?>
        <li class="nav-item">
            <a href="<?= site_url('usuarios'); ?>" class="nav-link <?= ($active === 'usuarios') ? 'active bg-primary text-white shadow-sm' : ''; ?>">
                <i class="nav-icon fas fa-users"></i>
                <p>Usuários</p>
            </a>
        </li>
    <?php endif; ?>

    <?php if (auth()->user()->can('conselho.visualizar')): ?>
        <li class="nav-item">
            <a href="<?= site_url('conselho'); ?>" class="nav-link <?= ($active === 'conselho') ? 'active bg-primary text-white shadow-sm' : ''; ?>">
                <i class="nav-icon fas fa-university"></i>
                <p>Conselhos</p>
            </a>
        </li>
    <?php endif; ?>

    <?php if (auth()->user()->can('profissionais.listar')): ?>
        <li class="nav-item">
            <a href="<?= site_url('profissionais'); ?>" class="nav-link <?= ($active === 'profissionais') ? 'active bg-primary text-white shadow-sm' : ''; ?>">
                <i class="nav-icon fas fa-user-tie"></i>
                <p>Profissionais</p>
            </a>
        </li>
    <?php endif; ?>

    <?php if (auth()->user()->can('profissoes.listar')): ?>
        <li class="nav-item">
            <a href="<?= site_url('profissoes'); ?>" class="nav-link <?= ($active === 'profissoes') ? 'active bg-primary text-white shadow-sm' : ''; ?>">
                <i class="nav-icon fas fa-briefcase"></i>
                <p>Profissões</p>
            </a>
        </li>
    <?php endif; ?>

    <?php if (auth()->user()->can('permissoes.gerenciar')): ?>
        <li class="nav-item">
            <a href="<?= site_url('permissoes'); ?>" class="nav-link <?= ($active === 'permissoes') ? 'active bg-primary text-white shadow-sm' : ''; ?>">
                <i class="nav-icon fas fa-lock"></i>
                <p>Permissões</p>
            </a>
        </li>
    <?php endif; ?>
</ul>