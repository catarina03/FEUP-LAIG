:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
	

% Game functions

:-include('game.pl').
:-include('humanVShuman.pl').

parse_input(start, 0) :-
	human_human.

parse_input(valid_moves(GameState, _-Row-Column, ListAdjacentMoves-ListEatMoves), ListAdjacentMoves-ListEatMoves) :-
	valid_moves(GameState, _-Row-Column, ListAdjacentMoves-ListEatMoves).

parse_input(is_valid_move(GameState, LAM-LEM, [Row, Column], MoveType), MoveType) :-
	is_valid_move(GameState, LAM-LEM, [Row, Column], MoveType).
parse_input(is_valid_move(GameState, LAM-LEM, [Row, Column], MoveType), null).

parse_input(change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, e), NewGameState) :-
	change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, e).
parse_input(change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, ElemEaten), NewGameState-ElemEaten) :-
	change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, ElemEaten).

parse_input(move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull), MoveType-NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull) :-
	move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull).
parse_input(move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull), 0).

parse_input(get_move_eat(RowInput, ColumnInput, NewListEat, NewGameState), NewListEat) :-
	get_move_eat(RowInput, ColumnInput, NewListEat, NewGameState).

parse_input(zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, Response), MoveType-NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull) :-
	zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, Response).
parse_input(zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, Response), 0).

parse_input(change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]),[PO1,PG1,PZ1]) :-
	change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]).

parse_input(is_over(GameState), 0) :- is_over(GameState).
parse_input(is_over(GameState), 1).

parse_input(choose_move(GameState, Player,Level,RowPiece-ColumnPiece-Row-Column), RowPiece-ColumnPiece-Row-Column) :-
	choose_move(GameState, Player,Level,RowPiece-ColumnPiece-Row-Column).

parse_input(move(GameState-[PO,PG,PZ]-Player-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull), NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull) :-
	move(GameState-[PO,PG,PZ]-Player-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull).

parse_input(play_again_bot(NewGameState-[PO1,PG1,PZ1], ListEat, Player-[Row, Column]-MoveType, NewerGameState-[PO2,PG2,PZ2]), NewerGameState-[PO2,PG2,PZ2]) :-
	play_again_bot(NewGameState-[PO1,PG1,PZ1], ListEat, Player-[Row, Column]-MoveType, NewerGameState-[PO2,PG2,PZ2]).

parse_input(play_zombies_bot(Level, NewerGameState-[PO2,PG2,PZ2]-Player-NewGreenSkull, _-_-RowZombie-ColumnZombie-MoveTypeZombie, NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull), NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull) :-
	play_zombies_bot(Level, NewerGameState-[PO2,PG2,PZ2]-Player-NewGreenSkull, _-_-RowZombie-ColumnZombie-MoveTypeZombie, NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull).

parse_input(play_zombies_bot(Level, NewerGameState-[PO2,PG2,PZ2]-Player-NewGreenSkull, _-_-RowZombie-ColumnZombie-MoveTypeZombie, NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull), NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull) :-
    play_again_zombies(NewZombieGameState-[PO3,PG3,PZ3]-NewerGreenSkull, ListEatZombie, Player-[RowZombie, ColumnZombie]-MoveTypeZombie, FinalGameState-[POF,PGF,PZF]-NewestGreenSkull).


