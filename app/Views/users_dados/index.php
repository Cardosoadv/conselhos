<?= $this->extend('template/layout') ?>

<?= $this->section('conteudo') ?>
<div class="card card-primary card-outline">
    <div class="card-header">
        <h3 class="card-title">
            <i class="fas fa-users me-2"></i>
            Lista de Usuários
        </h3>
        <div class="card-tools">
            <a href="<?= site_url('usuarios/new') ?>" class="btn btn-primary btn-sm">
                <i class="fas fa-plus me-1"></i> Novo Usuário
            </a>
        </div>
    </div>
    <div class="card-body">
        <?php if (session()->getFlashdata('message')): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i><?= session()->getFlashdata('message') ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>
        <?php if (session()->getFlashdata('error')): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i><?= session()->getFlashdata('error') ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <div class="table-responsive">
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th style="width: 50px;">ID</th>
                        <th style="width: 80px;">Imagem</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Email (User ID)</th>
                        <th>Cidade/UF</th>
                        <th style="width: 150px;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($usuarios)): ?>
                        <tr>
                            <td colspan="7" class="text-center text-muted">Nenhum usuário encontrado.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($usuarios as $usuario): ?>
                            <tr>
                                <td><?= $usuario['user_real_id'] ?></td>
                                <td>
                                    <?php if (!empty($usuario['imagem'])): ?>
                                        <img src="<?= site_url('usuarios/imagem/' . $usuario['user_real_id'] . '/' . $usuario['imagem']) ?>" alt="Foto" class="img-thumbnail rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                                    <?php else: ?>
                                        <span class="badge bg-secondary"><i class="fas fa-user"></i></span>
                                    <?php endif; ?>
                                </td>
                                <td><?= isset($usuario['nome']) ? esc($usuario['nome']) : '<span class="text-muted">Não cadastrado</span>' ?></td>
                                <td><?= isset($usuario['cpf']) ? esc($usuario['cpf']) : '-' ?></td>
                                <td><?= esc($usuario['e-mail']) ?></td>
                                <td><?= (isset($usuario['cidade']) && isset($usuario['estado'])) ? esc($usuario['cidade']) . '/' . esc($usuario['estado']) : '-' ?></td>
                                <td>
                                    <a href="<?= site_url('usuarios/' . $usuario['user_real_id'] . '/edit') ?>" class="btn btn-sm btn-warning" title="Editar Dados">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <?php if (isset($usuario['id'])): // Só mostra excluir se tiver dados complementares 
                                    ?>
                                        <form action="<?= site_url('usuarios/' . $usuario['user_real_id']) ?>" method="post" class="d-inline" onsubmit="return confirm('Tem certeza que deseja excluir os dados deste usuário?');">
                                            <input type="hidden" name="_method" value="DELETE">
                                            <button type="submit" class="btn btn-sm btn-danger" title="Excluir Dados"><i class="fas fa-trash"></i></button>
                                        </form>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?= $this->endSection() ?>