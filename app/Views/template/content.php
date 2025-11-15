<!--begin::App Main-->
<main class="app-main">
    <!--begin::App Content Header-->
    <div class="app-content-header">
        <!--begin::Container-->
        <div class="container-fluid">
            <!--begin::Row-->
            <?= $this->include('componentes/breadcrumbs') ?>
        </div><!--end::Container-->
    </div><!--end::App Content Header-->

    <!--begin::App Content-->
    <div class="app-content">
        <!--begin::Container-->
        <div class="container-fluid">
            <!--begin::Row - Widgets -->
            <div class="row">
                <!--begin::Col--> 
                <div class="col-lg-3 col-6">
                    <!-- Inicio da Notificação -->
                    <?= $this->include('componentes/notificacaoSessao') ?>

                    <?php if (auth()->user()->can('module.processos') || auth()->user()->can('exclusive.construtiva') ): ?>
                        <!--begin::Small Box Widget 1 - Processos -->
                        <div class="small-box text-bg-primary">
                            <div class="inner">
                                <h3><?= $qteProcessos ?></h3>
                                <p>Processos</p>
                            </div>
                            <div class="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
                                <i class="nav-icon bi bi-bank"></i>
                            </div>
                            <a href="<?=base_url('processos?encerrado=0')?>" class="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                                Mais informações
                                <i class="bi bi-link-45deg"></i>
                            </a>
                        </div><!--end::Small Box Widget 1-->
                    <?php endif; ?>
                </div><!--end::Col-->
                <div class="col-lg-3 col-6">
                    <?php if (auth()->user()->can('module.clientes')): ?>

                        <!--begin::Small Box Widget 2 - Clientes -->
                        <div class="small-box text-bg-success">
                            <div class="inner">
                                <h3><?= $qteClientes ?></h3>
                                <p>Clientes</p>
                            </div>
                            <div class="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
                            <i class="nav-icon bi bi-person"></i>
                            </div>
                            <a href="<?=base_url('clientes')?>" class="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                                Mais informações
                                <i class="bi bi-link-45deg"></i>
                            </a>
                        </div><!--end::Small Box Widget 2-->
                        <?php endif; ?>
                </div><!--end::Col-->
                <div class="col-lg-3 col-6">
                    <?php if (auth()->user()->can('module.tarefas')): ?>

                        <!--begin::Small Box Widget 3 - Tarefas -->
                        <div class="small-box text-bg-warning">
                            <div class="inner">
                                <h3><?= $qteTarefas ?></h3>
                                <p>Tarefas</p>
                            </div>
                            <div class="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
                            <i class="nav-icon bi bi-check2-square"></i>
                            </div>
                            <a href="<?=base_url('tarefas')?>" class="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                                Mais informações
                                <i class="bi bi-link-45deg"></i>
                            </a>
                        </div><!--end::Small Box Widget 3-->
                    <?php endif; ?>
                </div><!--end::Col-->

                <div class="col-lg-3 col-6">
                    <?php if (auth()->user()->can('module.financeiro')): ?>
                        <!--begin::Small Box Widget 4- Despesas Vencendo -->
                        <div class="small-box text-bg-danger">
                            <div class="inner">
                                <h3><?= $qteDespesasVencendo ?></h3>
                                <p>Despesas Vencendo</p>
                                
                            </div>
                            <div class="small-box-icon" fill="currentColor" viewBox="0 0 24 24">
                            <i class="nav-icon bi bi-cash"></i>
                            </div>
                            <a href="<?=base_url('financeiro/despesas')?>" class="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover">
                                Mais informações
                                <i class="bi bi-link-45deg"></i>
                            </a>
                        </div><!--end::Small Box Widget 4-->
                    <?php endif; ?>

            </div><!--end::Row - Widgets -->

            <?php if (auth()->user()->can('module.processos')): ?>
                <!--begin::Row - Graficos -->
                <div class="row">
                    <!--begin::Col - Grafico Comparativo de Processos-->
                    <div class="col-lg-12">
                        <!--begin::Card-->
                        <div class="card mb-5 mb-xl-10">
                            <!--begin::Card header-->
                            <div class="card-header border-0">
                                <!--begin::Card title-->
                                <div class="card-title">
                                    <h2>Visão Geral Processos</h2>
                                </div><!--end::Card title-->
                            </div><!--end::Card header-->
                            <!--begin::Card body-->
                            <div class="card-body pt-0 pb-5">
                                <!--begin::Chart-->
                                <div class="chart-container" style="height: 350px;">
                                    <canvas id="graficoProcessosComparativo"></canvas>
                                </div><!--end::Chart-->
                            </div><!--end::Card body-->
                        </div><!--end::Card-->
                    </div><!--end::Col - Grafico Comparativo de Processos -->
                </div>

                <div class="row">
                    <!--begin::Col - Grafico Processos Cadastrados-->
                    <div class="col-lg-6">
                        <!--begin::Card-->
                        <div class="card mb-5 mb-xl-10">
                            <!--begin::Card header-->
                            <div class="card-header border-0">
                                <!--begin::Card title-->
                                <div class="card-title">
                                    <h2>Processos Cadastrados</h2>
                                </div><!--end::Card title-->
                            </div><!--end::Card header-->
                            <!--begin::Card body-->
                            <div class="card-body pt-0 pb-5">
                                <!--begin::Chart-->
                                <div class="chart-container" style="height: 250px;">
                                    <canvas id="graficoProcessosCadastrados"></canvas>
                                </div><!--end::Chart-->
                            </div><!--end::Card body-->
                        </div><!--end::Card-->
                    </div><!--end::Col - Grafico Processos Cadastrados -->

                    <!--begin::Col - Grafico Processos Encerrados-->
                    <div class="col-lg-6">
                        <!--begin::Card-->
                        <div class="card mb-5 mb-xl-10">
                            <!--begin::Card header-->
                            <div class="card-header border-0">
                                <!--begin::Card title-->
                                <div class="card-title">
                                    <h2>Processos Encerrados</h2>
                                </div><!--end::Card title-->
                            </div><!--end::Card header-->
                            <!--begin::Card body-->
                            <div class="card-body pt-0 pb-5">
                                <!--begin::Chart-->
                                <div class="chart-container" style="height: 250px;">
                                    <canvas id="graficoProcessosEncerrados"></canvas>
                                </div><!--end::Chart-->
                            </div><!--end::Card body-->
                        </div><!--end::Card-->
                    </div><!--end::Col - Grafico Processos Encerrados -->


                </div>
            <?php endif; ?>


            <?php if (auth()->user()->can('module.financeiro')): ?>
                <!--begin::Row - Graficos -->
                <div class="row">
                    <!--begin::Col - Grafico Comparativo-->
                    <div class="col-lg-12">
                        <!--begin::Card-->
                        <div class="card mb-5 mb-xl-10">
                            <!--begin::Card header-->
                            <div class="card-header border-0">
                                <!--begin::Card title-->
                                <div class="card-title">
                                    <h2>Visão Geral Financeiro</h2>
                                </div><!--end::Card title-->
                            </div><!--end::Card header-->
                            <!--begin::Card body-->
                            <div class="card-body pt-0 pb-5">
                                <!--begin::Chart-->
                                <div class="chart-container" style="height: 350px;">
                                    <canvas id="graficoComparativo"></canvas>
                                </div><!--end::Chart-->
                            </div><!--end::Card body-->
                        </div><!--end::Card-->
                    </div><!--end::Col - Grafico Comparativo -->
                
                </div>
                <div class=row>
                    <!--begin::Col - Grafico Receitas-->
                    <div class="col-lg-6">
                        <!--begin::Card-->
                        <div class="card mb-5 mb-xl-10">
                            <!--begin::Card header-->
                            <div class="card-header border-0">
                                <!--begin::Card title-->
                                <div class="card-title">
                                    <h2>Visão Geral das Receitas</h2>
                                </div><!--end::Card title-->
                            </div><!--end::Card header-->
                            <!--begin::Card body-->
                            <div class="card-body pt-0 pb-5">
                                <!--begin::Chart-->
                                <div class="chart-container" style="height: 250px;">
                                    <canvas id="graficoReceitas"></canvas>
                                </div><!--end::Chart-->
                            </div><!--end::Card body-->
                        </div><!--end::Card-->
                    </div><!--end::Col - Grafico Receitas-->

                    <!--begin::Col - Grafico Despesas-->
                    <div class="col-lg-6">
                        <!--begin::Card-->
                        <div class="card mb-5 mb-xl-10">
                            <!--begin::Card header-->
                            <div class="card-header border-0">
                                <!--begin::Card title-->
                                <div class="card-title">
                                    <h2>Visão Geral das Despesas</h2>
                                </div><!--end::Card title-->
                            </div><!--end::Card header-->
                            <!--begin::Card body-->
                            <div class="card-body pt-0 pb-5">
                                <!--begin::Chart-->
                                <div class="chart-container" style="height: 250px;">
                                    <canvas id="graficoDespesas"></canvas>
                                </div><!--end::Chart-->
                            </div><!--end::Card body-->
                        </div><!--end::Card-->
                    </div><!--end::Col-->


                </div><!--end::Row - Graficos -->
            <?php endif; ?>

        </div><!--end::Container-->
    </div><!--end::App Content-->
</main><!--end::App Main-->