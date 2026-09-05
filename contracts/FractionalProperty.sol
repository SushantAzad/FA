// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @notice Development prototype. These tokens do not establish legal title to real estate.
contract FractionalProperty is ERC1155Supply, Ownable, ReentrancyGuard {
    struct Property {
        address seller;
        string title;
        string location;
        string metadataURI;
        uint256 shareCap;
        uint256 priceWei;
        bool approved;
        bool active;
    }

    uint256 public propertyCount;
    mapping(uint256 => Property) private _properties;
    mapping(address => uint256) public proceeds;

    event PropertyListed(uint256 indexed id, address indexed seller, string title, uint256 shareCap, uint256 priceWei);
    event PropertyApprovalChanged(uint256 indexed id, bool approved);
    event SaleStatusChanged(uint256 indexed id, bool active);
    event SharesPurchased(uint256 indexed id, address indexed buyer, uint256 shares, uint256 paidWei);
    event ProceedsWithdrawn(address indexed seller, uint256 amountWei);

    constructor(address admin) ERC1155("") Ownable(admin) {}

    function listProperty(string calldata title, string calldata location, string calldata metadataURI, uint256 shareCap, uint256 priceWei)
        external returns (uint256 id)
    {
        require(bytes(title).length > 0 && bytes(title).length <= 120, "Invalid title");
        require(bytes(location).length > 0 && bytes(location).length <= 240, "Invalid location");
        require(bytes(metadataURI).length <= 512, "URI too long");
        require(shareCap > 0 && shareCap <= 1_000_000_000, "Invalid share cap");
        require(priceWei > 0 && priceWei <= 1_000_000 ether, "Invalid share price");
        id = ++propertyCount;
        _properties[id] = Property(msg.sender, title, location, metadataURI, shareCap, priceWei, false, true);
        emit PropertyListed(id, msg.sender, title, shareCap, priceWei);
    }

    function getProperty(uint256 id) public view returns (Property memory) {
        require(id > 0 && id <= propertyCount, "Unknown property");
        return _properties[id];
    }

    function uri(uint256 id) public view override returns (string memory) {
        return getProperty(id).metadataURI;
    }

    function setApproved(uint256 id, bool approved) external onlyOwner {
        getProperty(id);
        _properties[id].approved = approved;
        emit PropertyApprovalChanged(id, approved);
    }

    function setSaleActive(uint256 id, bool active) external {
        Property memory property = getProperty(id);
        require(msg.sender == property.seller || msg.sender == owner(), "Not authorized");
        _properties[id].active = active;
        emit SaleStatusChanged(id, active);
    }

    function buyShares(uint256 id, uint256 shares) external payable nonReentrant {
        Property memory property = getProperty(id);
        require(property.approved && property.active, "Sale unavailable");
        require(shares > 0 && shares <= property.shareCap - totalSupply(id), "Invalid share quantity");
        require(msg.value == property.priceWei * shares, "Incorrect payment");
        proceeds[property.seller] += msg.value;
        // State is updated before the ERC-1155 receiver callback; reentry is guarded.
        _mint(msg.sender, id, shares, "");
        emit SharesPurchased(id, msg.sender, shares, msg.value);
    }

    function withdrawProceeds() external nonReentrant {
        uint256 amount = proceeds[msg.sender];
        require(amount > 0, "No proceeds");
        proceeds[msg.sender] = 0;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        emit ProceedsWithdrawn(msg.sender, amount);
    }
}
