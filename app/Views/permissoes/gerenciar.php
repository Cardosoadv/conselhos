<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card card-primary card-outline">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">
            <i class="fas fa-user-lock me-2"></i>
            Permissões para: <?= esc($user->username) ?>
        </h3>
        <a href="<?= site_url('permissoes') ?>" class="btn btn-secondary btn-sm"><i class="fas fa-arrow-left me-1"></i> Voltar</a>
    </div>
    <div class="card-body">
        <?php if (session()->getFlashdata('error')): ?>
            <div class="alert alert-danger">
                <?= session()->getFlashdata('error') ?>
            </div>
        <?php endif; ?>

        <form action="<?= site_url('permissoes/salvar/' . $user->id) ?>" method="post">
            <?= csrf_field() ?>

            <div class="row">
                <?php foreach ($groupedPermissions as $module => $permissions): ?>
                    <div class="col-md-6 mb-4">
                        <div class="card h-100 border">
                            <div class="card-header bg-light">
                                <h6 class="mb-0"><i class="fas fa-shield-alt me-2"></i>Módulo: <?= esc($module) ?></h6>
                            </div>
                            <div class="card-body">
                                <?php foreach ($permissions as $p): ?>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox"
                                            name="permissions[]"
                                            value="<?= esc($p['permission']) ?>"
                                            id="perm_<?= esc(str_replace('.', '_', $p['permission'])) ?>"
                                            <?= $p['has_permission'] ? 'checked' : '' ?>>
                                        <label class="form-check-label" for="perm_<?= esc(str_replace('.', '_', $p['permission'])) ?>">
                                            <strong><?= esc($p['permission']) ?></strong><br>
                                            <small class="text-muted"><?= esc($p['description']) ?></small>
                                        </label>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="mt-4 text-end">
                <button type="submit" class="btn btn-success"><i class="fas fa-save me-1"></i> Salvar Permissões</button>
            </div>
        </form>
    </div>
</div>
<?= $this->endSection() ?>