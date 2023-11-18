<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
service('auth')->routes($routes);

 $routes->get('/', 'Home::index');


 /**
 * --------------------------------------------------------------------
 * Include Modules Routes Files
 * --------------------------------------------------------------------
 */
if (file_exists(ROOTPATH.'modules')) {
	$modulesPath = ROOTPATH.'modules/';
	$modules = scandir($modulesPath);

	foreach ($modules as $module) {
		if ($module === '.' || $module === '..') continue;
		if (is_dir($modulesPath) . '/' . $module) {
			$routesPath = $modulesPath . $module . '/Config/Routes.php';
			if (file_exists($routesPath)) {
				require($routesPath);
			} else {
				continue;
			}
		}
	}
}