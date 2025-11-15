<?= $this->extend('template/layout') ?>

<?= $this->section('content') ?>
<div class="card">
    <div class="card-header">
        <h5 class="card-title"><?= isset($conselho) ? 'Editar Conselho' : 'Novo Conselho' ?></h5>
    </div>
    <div class="card-body">
        <form action="<?= isset($conselho) ? site_url('conselho/update/' . $conselho['id']) : site_url('conselho/create') ?>" method="post">
            <?php if (isset($conselho)): ?>
                <input type="hidden" name="_method" value="put">
            <?php endif; ?>
            <div class="form-group">
                <label for="nome">Nome</label>
                <input type="text" name="nome" id="nome" class="form-control" value="<?= isset($conselho) ? $conselho['nome'] : '' ?>">
            </div>
            <div class="form-group">
                <label for="sigla">Sigla</label>
                <input type="text" name="sigla" id="sigla" class="form-control" value="<?= isset($conselho) ? $conselho['sigla'] : '' ?>">
            </div>
            <button type="submit" class="btn btn-primary">Salvar</button>
        </form>
    </div>
</div>
<?= $this->endSection() ?>
