<!DOCTYPE html> 
<html lang="pt-BR">
<head>
    <title><?= $titulo ?></title>
    <?= $this->include('template/header') ?>
    
</head>

<body class="layout-fixed sidebar-expand-lg bg-body-tertiary">
    <div class="app-wrapper">
        <?= $this->include('template/nav') ?>
        <?= $this->include('template/sidebar') ?>

        <main class="app-main">
            <div class="app-content-header">
                <div class="container-fluid">
                    <?= $this->include('componentes/breadcrumbs') ?>
                </div>
            </div>
            <div class="app-content">
                <div class="container-fluid">
                    <div class="row">
                        <!-- Main Content Column -->
                        <div class="col-lg-9">
                            <?=  $this->renderSection('barraPesquisa') ?>
                            <!-- Notifications -->
                            <?= $this->include('componentes/notificacaoSessao') ?>
                            <!-- Results Info and Table -->
                            <?=  $this->renderSection('conteudo') ?>
                        </div><!-- End Main Content Column -->
                        <!-- Sidebar Column -->
                        <div class="col-lg-3">
                            <?=  $this->renderSection('sidebar') ?>
                        </div><!-- End Sidebar Column -->
                    </div><!-- End Row -->
                </div><!-- End Container Fluid -->
            </div><!-- End App Content -->
        </main>
        <?= $this->include('template/modals/change_user_img.php') ?>
        <?= $this->include('template/footer') ?>
    </div>
    <!-- Scripts Section -->
    <?=  $this->renderSection('scripts') ?>
    <!-- End Scripts Section -->
</body>
</html>