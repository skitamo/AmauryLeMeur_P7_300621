<!-- COMPONENT HEADER - Header du site -->

<template>
	
	<header class="header">
		
		<div class="headerBack">
			<slot name="back"></slot>
		</div>

		<div class="headerLogo">
			<img class="logo" alt="Logo Groupomania" src="@/assets/icon-left-font-monochrome-black.svg">
		</div>

		<div class="headerNav d-none d-lg-flex">
			<router-link :to="{ name: 'userConnectedProfile' }">
				<div class="userProfile">
					<slot name="profilePicture"></slot>
					<slot name="username"></slot>
				</div>
			</router-link>
		</div>

		<b-navbar-nav class="d-lg-none btn-lg" right>
			<b-nav-item-dropdown right no-caret>
				<template slot="button-content">
					<i class="fas fa-bars"></i>
				</template>
				<b-dropdown-item>
					<router-link :to="{ name: 'userConnectedProfile' }">
						<div class="userProfile">
							<slot name="profilePicture"></slot>
							<slot name="username"></slot>
						</div>
					</router-link>
				</b-dropdown-item>
				<b-dropdown-divider></b-dropdown-divider>
				<b-dropdown-item>
					<router-link to="/">
						<span class="userLogout">Se déconnecter</span>
					</router-link>
				</b-dropdown-item>
			</b-nav-item-dropdown>
		</b-navbar-nav>

	</header>

</template>

<script>
	
	export default {
		name: "Header",
		props: ["idUserConnected"],
	};

</script>

<style lang="scss">
	
	@font-face {
		font-family: "Montserrat";
		src: url(../font/Montserrat-Regular.ttf);
	}

	.header {
		display: flex;
		border-bottom: lightgrey 1px solid;
		padding: 10px;
		font-family: "Montserrat";
		font-size: 0.93em;
		justify-content: center;
		& .fa-bars {
			color: black;
		}
	}

	.headerBack {
		display: flex;
		position: absolute;
		left: 10px;
		top: 10px;
		font-size: 2.5em;
		margin-left: 10px;
		text-decoration: none;
		color: grey;
		cursor: pointer;
	}

	.headerLogo {
		height: 40px;
	}

	.logo {
		height: 100%;
	}

	.headerNav {
		display: flex;
		position: absolute;
		right: 0px;
		top: 0px;
		align-items: center;
		justify-content: center;
		padding: 8px;
		& a {
			text-decoration: none;
			color: black;
		}
	}

	.navbar-nav {
		position: absolute;
		right: 0px;
		top: 0px;
	}

	.userProfile {
		display: flex;
		align-items: center;
		padding: 10px;
		border-radius: 2px;
		color: black;
		cursor: pointer;
		& :hover {
			box-shadow: 0px 0px 4px lightgrey;
		}
	}

	.userLogout {
		padding: 15px;
		border-radius: 2px;
		cursor: pointer;
		text-decoration: none;
		color: black;
		& :hover {
			box-shadow: 0px 0px 4px lightgrey;
		}
	}

</style>