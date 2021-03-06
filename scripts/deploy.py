import json
import yaml
from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, config, network
from web3 import Web3
import os
import shutil

KEPT_BALANCE = Web3.toWei(100, "ether")


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        add_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(
            token.address, dict_of_allowed_tokens[token], {"from": account})
        set_tx.wait(1)
    return token_farm


def deploy_token_farm_and_dapp_token(should_update_front_end=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(dapp_token.address, {"from": account})
    tx = dapp_token.transfer(
        token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account})

    tx.wait(1)
    # dapp_token, cioban_token, fau_token/dai
    fau_token = get_contract("fau_token")
    cioban_token = get_contract("cioban_token")
    dict_of_allowed_tokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        cioban_token: get_contract("eth_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
    }
    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)
    if should_update_front_end:
        update_front_end()
    return token_farm, dapp_token


def update_front_end():
    copy_folders_to_front_end("./build", "./front_end/src/chain-info")
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Updated brownie-config.json")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_dapp_token(should_update_front_end=True)
