<?php
/*
 * description: Permite la administración de los principales elementos configurables para un servidor Motion 
 * author: ing. Antonio Membrides Espinosa
 * date: 02/10/2012
 * version: 1.0
 */
	class MotionConfigManager
	{
		private $paththread;
		private $pathmotion;
		private $tplthread;
		private $tplmotion;
		private $portlst;

		public function __construct( $path='cfg/', $pathmotion='cfg/motion.conf', $app='./cmd.sh' )
		{
			$this->paththread = realpath($path);
			$this->pathmotion = realpath($pathmotion);
			$this->tplthread = 'tpl/thread-conf.tpl';
			$this->tplmotion = 'tpl/motion-conf.tpl';
			$this->portlst = 'tpl/port.lst';
			$this->cmd = "sudo $app";
		}
		public function addThread($options)
		{
			$options = $this->formatOptions($options);
			$this->createFileFromTpl($options['tplthread'], $options['threadfile'],  $options);
			$this->updateMotionConf();
			$this->restarMotionServer();
		}

		public function dellThread($port)
		{
			$ports = json_decode(file_get_contents($this->portlst), true);
			$pos = array_search ($port, $ports);
			unset($ports[$pos]);
			file_put_contents ($this->portlst, json_encode($ports));
			$this->updateMotionConf();
			$this->restarMotionServer();
		}

		private function restarMotionServer()
		{
			exec('sudo service motion restart');
		}

		private function updateMotionConf()
		{
			exec('sudo cp '.$this->tplmotion.' '.$this->pathmotion);
			$data = '';
			$ports = json_decode(file_get_contents($this->portlst), true);
			foreach($ports as $i){
				$data = "thread ".realpath($this->paththread)."/thread-".$i.".conf \n";
				exec($this->cmd.' add "'.$data.'" '.$this->pathmotion); 
			}
		}

		private function formatOptions($cfg)
		{
			$cfg['channel'] = isset($cfg['channel']) ? $cfg['channel'] : '80';
			$cfg['agent'] = isset($cfg['agent']) ? $cfg['agent'] : '';
			$cfg['type'] = isset($cfg['type']) ? $cfg['type'] : 'axis';
			$cfg['port'] = isset($cfg['port']) ? $this->validatePort($cfg['port']) : $this->generatePort();
			$cfg['url'] = isset($cfg['url']) ? $cfg['url'] : $this->formatURL($cfg);

			$cfg['tplthread'] = isset($cfg['tplthread']) ? $cfg['tplthread'] : $this->tplthread;
			$cfg['threadfile'] = $this->paththread.'/thread-'.$cfg['port'].'.conf';
			return $cfg;
		}

		private function validatePort($port)
		{
			$ports = json_decode(file_get_contents($this->portlst), true);
			if(in_array($port, $ports)) die("Error: Port << $port >> are really in use");
			else {
				array_push($ports, $port);
				file_put_contents ($this->portlst, json_encode($ports));
				return $port;
			}
		}
		private function generatePort()
		{
			$ports = json_decode(file_get_contents($this->portlst), true);
			$current = array_pop($ports);
			$current = $current ? $current : 0;
			if(!$current) array_push($ports, $current+1); 
			else array_push($ports, $current, $current+1);
			file_put_contents ($this->portlst, json_encode($ports));
			return $current+1;
		}

		private function formatURL($cfg)
		{
			switch($cfg['type']){
				default: 
					$cfg['url'] = 'http://'.$cfg['ip'].":".$cfg['channel']."/".$cfg['agent'];
				break;
			}	
			return 	$cfg['url'];	
		}

		public function createFileFromTpl($fileTpl, $fileOut, $values) 
		{
			$GLOBALS = $values;
			if (file_exists($fileTpl)) {
			$tpl = file_get_contents($fileTpl);
			ob_start();
			eval('?><?php echo "' . $tpl . '";?><?php ');
			$data = ob_get_contents();
			file_put_contents($fileOut, $data);
			ob_end_clean();
		}else
			die("Error: La plantilla << {$fileTpl} >> No existe");
		}
	}
