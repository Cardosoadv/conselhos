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
            <i class="nav-icon bi bi-speedometer"></i>
            <p>Home</p>
        </a>
    </li>

    <?php
    /**
     * Checa permissão para exibir o menu de usuários
     */
    if ($permission['usuarios']): ?>
    <li class="nav-item">
        
        <a href="<?= site_url('usuarios'); ?>" class="nav-link <?= ($active === 'usuarios') ? 'active bg-primary text-white shadow-sm' : ''; ?>">
            <i class="nav-icon fas fa-scale-balanced"></i>
            <p>Usuários</p>
        </a>
    </li>
    <?php endif; ?>
</ul>
