import { AptosConfig, EntryFunction, EntryFunctionArgumentTypes, Identifier, ModuleId, MoveString, MoveVector, Network, TransactionPayloadEntryFunction, U64, U8 } from "..";
import { Serializable, Serializer } from "../bcs";
import { SingleSignerTransactionBuilder } from "../bcs/serializable/tx-builder/singleSignerTransactionBuilder";
import { TransactionBuilder } from "../bcs/serializable/tx-builder/transactionBuilder";
import { Account, AccountAddress } from "../core";
import { Signer } from "../core/signer";
import { HexInput, Uint8, Uint64, UserTransactionResponse } from "../types";
import { toAccountAddress } from "./utils";

const addressFromAny = (address: HexInput | AccountAddress): AccountAddress => {
  if (address instanceof AccountAddress) {
    return address;
  }
  return AccountAddress.fromHexInputRelaxed(address);
};




export namespace RockPaperScissor {
  export type CommitActionSerializableArgs = {
    player: AccountAddress;
    game_address: MoveVector<U8>;
  }

  export class CommitAction extends Serializable {
    public readonly moduleAddress = AccountAddress.fromHexInputRelaxed("0xa7693d83e4436fbac2f7fd478d468aec6386466a9506e6696751c99cb7b4cd44");
    public readonly moduleName = "rock_paper_scissor";
    public readonly functionName = "commit_action";
    public readonly args: CommitActionSerializableArgs;

    constructor(
      player: HexInput | AccountAddress,  // address
      game_address: Array<Uint8>,  // vector<u8>
    ) {
      super();
      this.args = {
        player: new AccountAddress(addressFromAny(player)),
        game_address: new MoveVector(game_address.map(argA => new U8(argA))),
      }
    }

    toPayload(): TransactionPayloadEntryFunction {
      const entryFunction = new EntryFunction(
        new ModuleId(this.moduleAddress, new Identifier(this.moduleName)),
        new Identifier(this.functionName),
        [],
        this.argsToArray()
      )
      return new TransactionPayloadEntryFunction(entryFunction)
    }

    argsToArray(): Array<EntryFunctionArgumentTypes> {
      return Object.keys(this.args).map(field => this.args[field as keyof typeof this.args]);
    }

    serialize(serializer: Serializer): void {
      const args = this.argsToArray();
      args.forEach(arg => {
        serializer.serialize(arg);
      });
    }
  }
  export type CreateGameSerializableArgs = {
    room_obj: AccountAddress;
    player1_address: AccountAddress;
    player2_address: AccountAddress;
    token1_address: AccountAddress;
  }

  export class CreateGame extends Serializable {
    public readonly moduleAddress = AccountAddress.fromHexInputRelaxed("0xa7693d83e4436fbac2f7fd478d468aec6386466a9506e6696751c99cb7b4cd44");
    public readonly moduleName = "rock_paper_scissor";
    public readonly functionName = "create_game";
    public readonly args: CreateGameSerializableArgs;

    constructor(
      room_obj: HexInput | AccountAddress,  // address
      player1_address: HexInput | AccountAddress,  // address
      player2_address: HexInput | AccountAddress,  // address
      token1_address: HexInput | AccountAddress,  // address
    ) {
      super();
      this.args = {
        room_obj: new AccountAddress(addressFromAny(room_obj)),
        player1_address: new AccountAddress(addressFromAny(player1_address)),
        player2_address: new AccountAddress(addressFromAny(player2_address)),
        token1_address: new AccountAddress(addressFromAny(token1_address)),
      }
    }

    toPayload(): TransactionPayloadEntryFunction {
      const entryFunction = new EntryFunction(
        new ModuleId(this.moduleAddress, new Identifier(this.moduleName)),
        new Identifier(this.functionName),
        [],
        this.argsToArray()
      )
      return new TransactionPayloadEntryFunction(entryFunction)
    }

    argsToArray(): Array<EntryFunctionArgumentTypes> {
      return Object.keys(this.args).map(field => this.args[field as keyof typeof this.args]);
    }

    serialize(serializer: Serializer): void {
      const args = this.argsToArray();
      args.forEach(arg => {
        serializer.serialize(arg);
      });
    }
  }
  export type ResetGameSerializableArgs = {
    game_address: AccountAddress;
  }

  export class ResetGame extends Serializable {
    public readonly moduleAddress = AccountAddress.fromHexInputRelaxed("0xa7693d83e4436fbac2f7fd478d468aec6386466a9506e6696751c99cb7b4cd44");
    public readonly moduleName = "rock_paper_scissor";
    public readonly functionName = "reset_game";
    public readonly args: ResetGameSerializableArgs;

    constructor(
      game_address: HexInput | AccountAddress,  // address
    ) {
      super();
      this.args = {
        game_address: new AccountAddress(addressFromAny(game_address)),
      }
    }

    toPayload(): TransactionPayloadEntryFunction {
      const entryFunction = new EntryFunction(
        new ModuleId(this.moduleAddress, new Identifier(this.moduleName)),
        new Identifier(this.functionName),
        [],
        this.argsToArray()
      )
      return new TransactionPayloadEntryFunction(entryFunction)
    }

    argsToArray(): Array<EntryFunctionArgumentTypes> {
      return Object.keys(this.args).map(field => this.args[field as keyof typeof this.args]);
    }

    serialize(serializer: Serializer): void {
      const args = this.argsToArray();
      args.forEach(arg => {
        serializer.serialize(arg);
      });
    }
  }
  export type VerifyActionSerializableArgs = {
    player: AccountAddress;
    game_address: MoveVector<U8>;
    action: MoveVector<U8>;
  }

  export class VerifyAction extends Serializable {
    public readonly moduleAddress = AccountAddress.fromHexInputRelaxed("0xa7693d83e4436fbac2f7fd478d468aec6386466a9506e6696751c99cb7b4cd44");
    public readonly moduleName = "rock_paper_scissor";
    public readonly functionName = "verify_action";
    public readonly args: VerifyActionSerializableArgs;

    constructor(
      player: HexInput | AccountAddress,  // address
      game_address: Array<Uint8>,  // vector<u8>
      action: Array<Uint8>,  // vector<u8>
    ) {
      super();
      this.args = {
        player: new AccountAddress(addressFromAny(player)),
        game_address: new MoveVector(game_address.map(argA => new U8(argA))),
        action: new MoveVector(action.map(argA => new U8(argA))),
      }
    }

    toPayload(): TransactionPayloadEntryFunction {
      const entryFunction = new EntryFunction(
        new ModuleId(this.moduleAddress, new Identifier(this.moduleName)),
        new Identifier(this.functionName),
        [],
        this.argsToArray()
      )
      return new TransactionPayloadEntryFunction(entryFunction)
    }

    argsToArray(): Array<EntryFunctionArgumentTypes> {
      return Object.keys(this.args).map(field => this.args[field as keyof typeof this.args]);
    }

    serialize(serializer: Serializer): void {
      const args = this.argsToArray();
      args.forEach(arg => {
        serializer.serialize(arg);
      });
    }
  }
}

export namespace TournamentManager {
  export type InitializeTournamentSerializableArgs = {
    tournament_creator: MoveString;
    tournament_name: U64;
    max_players: U64;
    num_winners: U64;
  }

  export class InitializeTournament extends Serializable {
    public readonly moduleAddress = AccountAddress.fromHexInputRelaxed("0xa7693d83e4436fbac2f7fd478d468aec6386466a9506e6696751c99cb7b4cd44");
    public readonly moduleName = "tournament_manager";
    public readonly functionName = "initialize_tournament";
    public readonly args: InitializeTournamentSerializableArgs;

    constructor(
      tournament_creator: string,  // 0x1::string::String
      tournament_name: Uint64,  // u64
      max_players: Uint64,  // u64
      num_winners: Uint64,  // u64
    ) {
      super();
      this.args = {
        tournament_creator: new MoveString(tournament_creator),
        tournament_name: new U64(tournament_name),
        max_players: new U64(max_players),
        num_winners: new U64(num_winners),
          }
    }

    toPayload(): TransactionPayloadEntryFunction {
      const entryFunction = new EntryFunction(
        new ModuleId(this.moduleAddress, new Identifier(this.moduleName)),
        new Identifier(this.functionName),
        [],
        this.argsToArray()
      )
      return new TransactionPayloadEntryFunction(entryFunction)
    }

    argsToArray(): Array<EntryFunctionArgumentTypes> {
      return Object.keys(this.args).map(field => this.args[field as keyof typeof this.args]);
    }

    serialize(serializer: Serializer): void {
      const args = this.argsToArray();
      args.forEach(arg => {
        serializer.serialize(arg);
      });
    }
  }
  export type JoinTournamentSerializableArgs = {
    player: AccountAddress;
    tournament_address: MoveString;
  }

  export class JoinTournament extends Serializable {
    public readonly moduleAddress = AccountAddress.fromHexInputRelaxed("0xa7693d83e4436fbac2f7fd478d468aec6386466a9506e6696751c99cb7b4cd44");
    public readonly moduleName = "tournament_manager";
    public readonly functionName = "join_tournament";
    public readonly args: JoinTournamentSerializableArgs;

    constructor(
      player: HexInput | AccountAddress,  // address
      tournament_address: string,  // 0x1::string::String
    ) {
      super();
      this.args = {
        player: new AccountAddress(addressFromAny(player)),
        tournament_address: new MoveString(tournament_address),
      }
    }

    toPayload(): TransactionPayloadEntryFunction {
      const entryFunction = new EntryFunction(
        new ModuleId(this.moduleAddress, new Identifier(this.moduleName)),
        new Identifier(this.functionName),
        [],
        this.argsToArray()
      )
      return new TransactionPayloadEntryFunction(entryFunction)
    }

    argsToArray(): Array<EntryFunctionArgumentTypes> {
      return Object.keys(this.args).map(field => this.args[field as keyof typeof this.args]);
    }

    serialize(serializer: Serializer): void {
      const args = this.argsToArray();
      args.forEach(arg => {
        serializer.serialize(arg);
      });
    }
  }
  export type StartNewRoundSerializableArgs = {
    tournament_creator: AccountAddress;
  }

  export class StartNewRound extends Serializable {
    public readonly moduleAddress = AccountAddress.fromHexInputRelaxed("0xa7693d83e4436fbac2f7fd478d468aec6386466a9506e6696751c99cb7b4cd44");
    public readonly moduleName = "tournament_manager";
    public readonly functionName = "start_new_round";
    public readonly args: StartNewRoundSerializableArgs;

    constructor(
      tournament_creator: HexInput | AccountAddress,  // address
    ) {
      super();
      this.args = {
        tournament_creator: new AccountAddress(addressFromAny(tournament_creator)),
      }
    }

    toPayload(): TransactionPayloadEntryFunction {
      const entryFunction = new EntryFunction(
        new ModuleId(this.moduleAddress, new Identifier(this.moduleName)),
        new Identifier(this.functionName),
        [],
        this.argsToArray()
      )
      return new TransactionPayloadEntryFunction(entryFunction)
    }

    argsToArray(): Array<EntryFunctionArgumentTypes> {
      return Object.keys(this.args).map(field => this.args[field as keyof typeof this.args]);
    }

    serialize(serializer: Serializer): void {
      const args = this.argsToArray();
      args.forEach(arg => {
        serializer.serialize(arg);
      });
    }
  }
}