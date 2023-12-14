<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
service('auth')->routes($routes);

 $routes->get('admin/', '\Modules\Admin\Controllers\Home::index');
 $routes->get('admin/system', '\Modules\Admin\Controllers\Home::system');

