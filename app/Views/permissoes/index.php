<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card">
    <div class="card-body">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($users) && is_array($users)): ?>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?= esc($user->id) ?></td>
                            <td><?= esc($user->username) ?></td>
                            <td><?= esc($user->email) ?></td>
                            <td>
                                <a href="<?= base_url('permissoes/gerenciar/' . $user->id) ?>" class="btn btn-primary btn-sm">
                                    Gerenciar Permissões
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="4" class="text-center">Nenhum usuário encontrado.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
<?= $this->endSection() ?>