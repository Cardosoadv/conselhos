<!DOCTYPE html> 
<html lang="pt-BR">
<head>
    <title><?= $titulo ?></title>
    <?= $this->include('template/header') ?>
    <!-- Head Section -->
    <?=  $this->renderSection('header') ?>
    <!-- End Head Section -->
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
                            <!-- Conteúdo Principal -->
                            <?=  $this->renderSection('conteudo') ?>
                            <!-- End Conteúdo Principal-->
                        </div>
                        <!-- Sidebar Column -->
                        <div class="col-lg-3">
                            <?=  $this->renderSection('conteudoSidebar') ?>
                        </div><!-- End Sidebar Column -->
                    </div><!-- End Row -->
                </div><!-- End Container Fluid -->
            </div><!-- End App Content -->
        </main>
        <?= $this->include('template/modals/change_user_img.php') ?>
        <?= $this->include('template/footer') ?>
        <!-- Modals Section -->
        <?=  $this->renderSection('modals') ?>
        <!-- End Modals Section -->
    </div>
    <!-- Scripts Section -->
    <?=  $this->renderSection('scripts') ?>
    <!-- End Scripts Section -->
</body>
</html>