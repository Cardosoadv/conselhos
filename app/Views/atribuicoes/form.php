<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card card-primary card-outline">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">
            <i class="fas fa-tasks me-2"></i>
            <?= isset($atribuicao) ? 'Editar' : 'Nova' ?> Atribuição
        </h3>
        <a href="<?= site_url('atribuicoes') ?>" class="btn btn-secondary btn-sm"><i class="fas fa-arrow-left me-1"></i> Voltar</a>
    </div>
    <div class="card-body">
        <?php if (session()->getFlashdata('errors')): ?>
            <div class="alert alert-danger">
                <ul class="mb-0">
                    <?php foreach (session()->getFlashdata('errors') as $error): ?>
                        <li><?= esc($error) ?></li>
                    <?php endforeach ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php
        $action = isset($atribuicao) ? site_url('atribuicoes/update/' . $atribuicao['id']) : site_url('atribuicoes/create');
        ?>

        <form action="<?= $action ?>" method="post">
            <?= csrf_field() ?>

            <div class="mb-3">
                <label for="nome" class="form-label">Nome</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-tag"></i></span>
                    <input type="text" class="form-control" id="nome" name="nome" value="<?= old('nome', $atribuicao['nome'] ?? '') ?>" required>
                </div>
            </div>

            <div class="mb-3">
                <label for="requisitos" class="form-label">Requisitos</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-align-left"></i></span>
                    <textarea class="form-control" id="requisitos" name="requisitos" rows="5" required><?= old('requisitos', $atribuicao['requisitos'] ?? '') ?></textarea>
                </div>
                <small class="form-text text-muted">Detalhamento dos requisitos para esta atribuição.</small>
            </div>

            <div class="mt-4 text-end">
                <button type="submit" class="btn btn-success"><i class="fas fa-save me-1"></i> Salvar</button>
            </div>
        </form>
    </div>
</div>
<?= $this->endSection() ?>
