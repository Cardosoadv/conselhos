<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Permissões - <?= esc($user->username) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Permissões para: <?= esc($user->username) ?></h1>
            <a href="/permissoes" class="btn btn-secondary">Voltar</a>
        </div>

        <?php if (session()->getFlashdata('error')): ?>
            <div class="alert alert-danger">
                <?= session()->getFlashdata('error') ?>
            </div>
        <?php endif; ?>

        <form action="/permissoes/salvar/<?= $user->id ?>" method="post">
            <?= csrf_field() ?>

            <div class="row">
                <?php foreach ($groupedPermissions as $module => $permissions): ?>
                    <div class="col-md-6 mb-4">
                        <div class="card h-100">
                            <div class="card-header bg-light">
                                <h5 class="mb-0">Módulo: <?= esc($module) ?></h5>
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

            <div class="mt-4 mb-5">
                <button type="submit" class="btn btn-success btn-lg">Salvar Permissões</button>
            </div>
        </form>
    </div>
</body>
</html>
