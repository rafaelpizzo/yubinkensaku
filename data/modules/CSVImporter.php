<?php
/**
 * Read, filter and import CSV data
 *
 * @author Rafael Pizzo <http://www.rafaelpizzo.com/>
 * @version 1.0.0
 */

use Goodby\CSV\Import\Standard\Lexer;
use Goodby\CSV\Import\Standard\Interpreter;
use Goodby\CSV\Import\Standard\LexerConfig;

class CSVImporter {
	public $itemData;
	public $itemQueue = array();

	public function __construct($params = array()) {
		$this->itemData = $this->decodeCSV($params['source'], $params['structure'], $params['settings']);
	}

	public function import($params = array()) {
		$settings = array(
			'debugMode' => false,
		);

		foreach($params as $key => $value) {
			if(array_key_exists($key, $settings)) {
				$settings[$key] = $value;
			}
		}

		$items = $this->itemData;
		for ($i=0; $i < count($items); $i++) {
			$item = $items[$i];
			if(!$settings['debugMode']) {
				$itemID = $this->addItem($item, $i);
				$this->addToQueue($itemID, $item, $i);
			} else {
				$this->itemQueue[$item['id']] = $item;
			}
		}

		return $this->itemQueue;
	}

	public function addToQueue($itemID, $item, $index) {
		if(!empty($itemID)) {
			if(isset($item['id'])) {
				$this->itemQueue[$itemID] = "[".$item['id']."]";
			} else {
				$this->itemQueue[$itemID] = "__[".$index."]";
			}
		} else {
			$this->itemQueue["__[".$index."]"] = $itemID;
		}
	}

	protected function addItem($item, $index, $parent = null) {
		$args = array(
			'item_title'  => null,
		);
		$newPostID = wp_insert_item($args);

		update_field('item_title', $item['title'], $newPostID);

		return $newPostID;
	}

	protected function condition($row, $structure) {
		$continue = true;

		if (
			!isset($row[$structure['id']])
		) {
			$continue = false;
		}

		return $continue;
	}

	public function decodeCSV($path, $structure, $args = array()) {
		$settings = array(
			"delimiter" => ';',
			"enclosure"	=> "'",
			"escape"	=> "\\"
		);
		
		if (!empty($args) && is_array($args)) {
			foreach($args as $key => $value) {
				if(array_key_exists($key, $settings)) {
					$settings[$key] = $value;
				}
			}
		}
		
		$filePath = parse_url($path, PHP_URL_PATH);
		if(is_dir($filePath) == false && file_exists($filePath) ) {
			$fullData = [];
			$config = new LexerConfig();
			$config->setDelimiter($settings["delimiter"])->setEnclosure($settings["enclosure"])->setEscape($settings["escape"]);
			$lexer = new Lexer($config);
			$interpreter = new Interpreter();
			$interpreter->unstrict();
			$interpreter->addObserver(function(array $row) use (&$fullData, &$structure) {
				if($this->condition($row, $structure) == true) {
					$data = [];
					foreach ($structure as $key => $value) {
						if(isset($row[$value])) {
							$data[$key] = $row[$value];
							$data[$key] = mb_convert_encoding($row[$value], "UTF-8");
						}
					}
					if($data != null) {
						array_push($fullData, $data);
					}
				}
			});
			$lexer->parse($filePath, $interpreter);

			return $fullData;
		} else {
			return null;
		}
	}

	public function getFilePath($path) {
		$filePath = parse_url($this->filePath . urldecode($path), PHP_URL_PATH);
		if(is_dir($filePath) == false && file_exists($filePath) ) {
			return $filePath;
		} else {
			return false;
		}
	}
}