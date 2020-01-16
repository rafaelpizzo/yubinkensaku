<?php
class AddressParser extends CSVImporter {
	public $currentGroupCode = null;
	public $addressGroup = array();
	
	public function __construct($params = array()) {
		parent::__construct($params);
	}
	
	protected function condition($row, $structure) {
		return true;
	}

	protected function addItem($item, $index, $parent = null) {
		$itemCode = str_pad($item['id'], 7, "0", STR_PAD_LEFT);
		$groupCode = substr($itemCode, 0, 2) . "0";
		
		$addressItem = array(
			"code" 			=> $itemCode,
			"japanese"		=> array(
				"region"		=> $item['jp_region'],
				"locality"		=> $item['jp_locality'],
				"street"		=> $item['jp_street'],
			),
			"romaji"		=> array(
				"region"		=> $item['ro_region'],
				"locality"		=> $item['ro_locality'],
				"street"		=> $item['ro_street'],
			)
		);
		
		if ($this->currentGroupCode != $groupCode) {
			$this->flushGroups();
			$this->currentGroupCode = $groupCode;
		}
		
		$this->addressGroup[$itemCode] = $addressItem;
	}
	
	protected function flushGroups() {
		if ($this->currentGroupCode == null) { return; }
		
		$filePath = __DIR__ . "\\..\\export\\" . $this->currentGroupCode . '.json';
		file_put_contents($filePath, json_encode($this->addressGroup, JSON_UNESCAPED_UNICODE));
		
		$this->addressGroup = array();
	}
}